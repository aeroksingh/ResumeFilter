const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")

/* ─── AI Client ─────────────────────────────────────────────────────── */

let ai = null
if (process.env.GOOGLE_GENAI_API_KEY && process.env.GOOGLE_GENAI_API_KEY !== 'YOUR_GOOGLE_GENAI_API_KEY_HERE') {
    const { GoogleGenAI } = require("@google/genai")
    ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY })
} else {
    console.warn("GOOGLE_GENAI_API_KEY is missing or set to a placeholder. AI features will fail.")
}

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash"

/* ─── Retry Helper (exponential backoff with rate-limit awareness) ── */

const MAX_RETRIES = 3
const BASE_DELAY_MS = 1000

/**
 * Calls the Gemini API with automatic retry on transient / rate-limit errors.
 * - 429 (RESOURCE_EXHAUSTED) → waits using Retry-After header or exponential backoff
 * - 500 / 503                → retries with exponential backoff
 * - All other errors         → thrown immediately (no retry)
 */
async function callGeminiWithRetry(requestPayload) {
    if (!ai) {
        throw new Error("AI client not configured. Set GOOGLE_GENAI_API_KEY in .env")
    }

    let lastError = null

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const response = await ai.models.generateContent(requestPayload)

            if (!response.text) {
                throw new Error("Gemini returned an empty response.")
            }

            return JSON.parse(response.text)
        } catch (err) {
            lastError = err
            const status = err.status || err.code || err.httpStatusCode

            const isRateLimit = status === 429
                || (err.message && err.message.includes("RESOURCE_EXHAUSTED"))
            const isServerError = status === 500 || status === 503
                || (err.message && err.message.includes("UNAVAILABLE"))

            if (!isRateLimit && !isServerError) {
                // Non-retryable error (400, 401, 403, malformed response, etc.)
                throw err
            }

            if (attempt === MAX_RETRIES) {
                break // exhaust retries, fall through to throw
            }

            // Determine wait time
            let delayMs = BASE_DELAY_MS * Math.pow(2, attempt)

            if (isRateLimit) {
                // Respect Retry-After header if present (value in seconds)
                const retryAfter = err.headers?.["retry-after"]
                    || err.errorDetails?.find(d => d.retryDelay)?.retryDelay
                if (retryAfter) {
                    const parsed = typeof retryAfter === "string"
                        ? parseInt(retryAfter, 10)
                        : retryAfter
                    if (!isNaN(parsed) && parsed > 0) {
                        delayMs = parsed * 1000
                    }
                }
            }

            console.warn(
                `Gemini API attempt ${attempt + 1}/${MAX_RETRIES + 1} failed (${isRateLimit ? "rate-limited" : "server error"}). ` +
                `Retrying in ${delayMs}ms…`
            )

            await new Promise(resolve => setTimeout(resolve, delayMs))
        }
    }

    throw new Error(
        `Gemini API call failed after ${MAX_RETRIES + 1} attempts. Last error: ${lastError?.message || "Unknown"}`
    )
}

/* ─── Schemas ───────────────────────────────────────────────────────── */

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })).describe("Technical questions for the interview"),
    behavioralQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })).describe("Behavioral questions for the interview"),
    skillGaps: z.array(z.object({
        skill: z.string(),
        severity: z.enum(["low", "medium", "high"])
    })).describe("Skill gaps in the candidate's profile"),
    preparationPlan: z.array(z.object({
        day: z.number(),
        focus: z.string(),
        tasks: z.array(z.string())
    })).describe("Day-wise preparation plan"),
    title: z.string().describe("The job title from the job description"),
})

const resumePdfSchema = z.object({
    html: z.string().describe("The HTML content of the resume")
})

/* ─── Interview Report Generation ───────────────────────────────────── */

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate an interview report for a candidate with the following details:
Resume: ${resume || "Not provided"}
Self Description: ${selfDescription || "Not provided"}
Job Description: ${jobDescription}`

    return callGeminiWithRetry({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })
}

/* ─── PDF Generation (serverless-optimised Puppeteer) ───────────────── */

/**
 * Launches a lightweight Chromium instance compatible with serverless platforms.
 * - In production / Vercel: uses @sparticuz/chromium (≤50 MB compressed)
 * - Locally (NODE_ENV=development): falls back to locally-installed Chrome
 */
async function getBrowser() {
    if (process.env.NODE_ENV === "production") {
        const chromium = require("@sparticuz/chromium")
        const puppeteerCore = require("puppeteer-core")

        return puppeteerCore.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        })
    }

    // Local development — use puppeteer-core with system Chrome
    const puppeteerCore = require("puppeteer-core")

    // Common Chrome paths per OS
    const possiblePaths = [
        // Windows
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        process.env.LOCALAPPDATA && `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
        // macOS
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        // Linux
        "/usr/bin/google-chrome",
        "/usr/bin/google-chrome-stable",
        "/usr/bin/chromium-browser",
    ].filter(Boolean)

    const fs = require("fs")
    const executablePath = possiblePaths.find(p => fs.existsSync(p))

    if (!executablePath) {
        throw new Error(
            "Could not find a local Chrome/Chromium installation. " +
            "Install Google Chrome or set NODE_ENV=production to use @sparticuz/chromium."
        )
    }

    return puppeteerCore.launch({
        executablePath,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: "new",
    })
}

async function generatePdfFromHtml(htmlContent) {
    let browser = null
    try {
        browser = await getBrowser()
        const page = await browser.newPage()
        await page.setContent(htmlContent, { waitUntil: "networkidle0" })

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" }
        })

        return pdfBuffer
    } finally {
        if (browser) {
            await browser.close().catch(() => {})
        }
    }
}

/* ─── Resume PDF Generation ─────────────────────────────────────────── */

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate a professional, ATS-friendly resume in HTML format for a candidate with:
Resume: ${resume || "Not provided"}
Self Description: ${selfDescription || "Not provided"}
Job Description: ${jobDescription}

Requirements:
- Tailor it to the job description
- Simple, professional design (1-2 pages)
- ATS-friendly structure
- No AI-sounding language
- Include only relevant information
- Return a single "html" field with complete HTML`

    const jsonContent = await callGeminiWithRetry({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })

    return generatePdfFromHtml(jsonContent.html)
}

module.exports = { generateInterviewReport, generateResumePdf }
