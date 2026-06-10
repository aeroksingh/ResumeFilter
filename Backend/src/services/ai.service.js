const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

let ai = null
if (process.env.GOOGLE_GENAI_API_KEY) {
    const { GoogleGenAI } = require("@google/genai")
    ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY })
} else {
    console.warn("GOOGLE_GENAI_API_KEY not set. AI features will throw if used.")
}

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

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    if (!ai) throw new Error("AI client not configured. Set GOOGLE_GENAI_API_KEY in .env")

    const prompt = `Generate an interview report for a candidate with the following details:
Resume: ${resume || "Not provided"}
Self Description: ${selfDescription || "Not provided"}
Job Description: ${jobDescription}`

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })

    return JSON.parse(response.text)
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] })
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" }
    })

    await browser.close()
    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    if (!ai) throw new Error("AI client not configured. Set GOOGLE_GENAI_API_KEY in .env")

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume")
    })

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

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })

    const jsonContent = JSON.parse(response.text)
    return await generatePdfFromHtml(jsonContent.html)
}

module.exports = { generateInterviewReport, generateResumePdf }
