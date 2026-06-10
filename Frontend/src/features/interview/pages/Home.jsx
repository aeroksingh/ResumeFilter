import React, { useState, useRef, useEffect } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import './home.css'

const Home = () => {
    const { loading, generateReport, getReports, reports, error } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [resumeFile, setResumeFile] = useState(null)
    const [formError, setFormError] = useState(null)
    const resumeInputRef = useRef()
    const navigate = useNavigate()

    useEffect(() => {
        getReports()
    }, [])

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file && file.type !== "application/pdf") {
            setFormError("Only PDF files are supported.")
            resumeInputRef.current.value = ""
            setResumeFile(null)
            return
        }
        setFormError(null)
        setResumeFile(file || null)
    }

    const handleGenerateReport = async () => {
        setFormError(null)
        if (!jobDescription.trim()) {
            setFormError("Job description is required.")
            return
        }
        if (!resumeFile && !selfDescription.trim()) {
            setFormError("Please upload a resume or enter a self description.")
            return
        }

        const data = await generateReport({ jobDescription, selfDescription, resumeFile })
        if (data) {
            navigate(`/interview/${data._id}`)
        }
    }

    if (loading) {
        return (
            <main className="loading-screen">
                <div className="loading-inner">
                    <div className="spinner" />
                    <p>Generating your interview plan...</p>
                </div>
            </main>
        )
    }

    return (
        <div className="home-page">
            <header className="page-header">
                <h1>Interview Preparation <span>Planner</span></h1>
                <p>Upload your resume and job description to generate a personalized interview strategy.</p>
            </header>

            <div className="interview-card">
                {(formError || error) && (
                    <div className="form-error">{formError || error}</div>
                )}

                <div className="card-body">
                    <div className="panel">
                        <div className="panel-label">
                            <span className="panel-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                            </span>
                            Job Description <span className="required-badge">Required</span>
                        </div>
                        <textarea
                            onChange={(e) => setJobDescription(e.target.value)}
                            value={jobDescription}
                            className="panel-textarea"
                            placeholder="Paste the full job description here..."
                            maxLength={5000}
                        />
                        <div className="char-counter">{jobDescription.length} / 5000</div>
                    </div>

                    <div className="panel-divider" />

                    <div className="panel">
                        <div className="panel-label">
                            <span className="panel-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </span>
                            Your Profile
                        </div>

                        <label className="field-label">Upload Resume (PDF)</label>
                        <label className={`dropzone ${resumeFile ? 'dropzone--active' : ''}`} htmlFor="resume">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                            <p>{resumeFile ? resumeFile.name : "Click to upload PDF"}</p>
                            <span>Max 5MB</span>
                            <input
                                ref={resumeInputRef}
                                hidden type="file" id="resume" name="resume"
                                accept=".pdf"
                                onChange={handleFileChange}
                            />
                        </label>

                        <div className="or-divider"><span>or</span></div>

                        <label className="field-label" htmlFor="selfDescription">Self Description</label>
                        <textarea
                            onChange={(e) => setSelfDescription(e.target.value)}
                            value={selfDescription}
                            id="selfDescription"
                            className="panel-textarea panel-textarea--short"
                            placeholder="Describe your experience, skills, and years of experience..."
                        />
                    </div>
                </div>

                <div className="card-footer">
                    <span className="footer-note">AI-powered · ~30 seconds</span>
                    <button onClick={handleGenerateReport} className="generate-btn">
                        Generate Interview Plan
                    </button>
                </div>
            </div>

            {reports.length > 0 && (
                <section className="recent-reports">
                    <h2>Recent Plans</h2>
                    <div className="reports-grid">
                        {reports.map(report => (
                            <div
                                key={report._id}
                                className="report-card"
                                onClick={() => navigate(`/interview/${report._id}`)}
                            >
                                <h3>{report.title || 'Untitled Position'}</h3>
                                <p className="report-date">{new Date(report.createdAt).toLocaleDateString()}</p>
                                <div className={`score-badge ${report.matchScore >= 80 ? 'score-high' : report.matchScore >= 60 ? 'score-mid' : 'score-low'}`}>
                                    {report.matchScore}% match
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}

export default Home
