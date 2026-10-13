import { createContext, useState, useMemo } from "react"

export const InterviewContext = createContext()

export const InterviewProvider = ({ children }) => {
    const [report, setReport] = useState(null)
    const [reports, setReports] = useState([])

    const value = useMemo(() => ({
        report, setReport, reports, setReports
    }), [report, reports])

    return (
        <InterviewContext.Provider value={value}>
            {children}
        </InterviewContext.Provider>
    )
}
