import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useState, useCallback } from "react"
import { InterviewContext } from "../interview.context"

export const useInterview = () => {
    const context = useContext(InterviewContext)

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { report, setReport, reports, setReports } = context

    // Localize loading and error states so they don't block the whole app with the wrong message
    const [isGenerating, setIsGenerating] = useState(false)
    const [isFetchingReports, setIsFetchingReports] = useState(false)
    const [isFetchingReport, setIsFetchingReport] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [error, setError] = useState(null)

    const generateReport = useCallback(async ({ jobDescription, selfDescription, resumeFile }) => {
        setIsGenerating(true)
        setError(null)
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to generate report. The AI service may be temporarily unavailable."
            setError(msg)
            return null
        } finally {
            setIsGenerating(false)
        }
    }, [setReport])

    const getReportById = useCallback(async (id) => {
        setIsFetchingReport(true)
        setError(null)
        try {
            const response = await getInterviewReportById(id)
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to fetch report."
            setError(msg)
            return null
        } finally {
            setIsFetchingReport(false)
        }
    }, [setReport])

    const getReports = useCallback(async () => {
        setIsFetchingReports(true)
        setError(null)
        try {
            const response = await getAllInterviewReports()
            setReports(response.interviewReports)
            return response.interviewReports
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch reports.")
            return []
        } finally {
            setIsFetchingReports(false)
        }
    }, [setReports])

    const getResumePdf = useCallback(async (interviewReportId) => {
        setIsDownloading(true)
        setError(null)
        try {
            const response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        } catch (err) {
            setError(err.response?.data?.message || "Failed to generate PDF. The AI service may be temporarily unavailable.")
        } finally {
            setIsDownloading(false)
        }
    }, [])

    return {
        report,
        reports,
        error,
        isGenerating,
        isFetchingReports,
        isFetchingReport,
        isDownloading,
        generateReport,
        getReportById,
        getReports,
        getResumePdf
    }
}
