import React, { useState, useEffect } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'
import './interview.css'

const NAV_ITEMS = [
    {
        id: 'technical', label: 'Technical Questions',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
    },
    {
        id: 'behavioral', label: 'Behavioral Questions',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
    },
    {
        id: 'roadmap', label: 'Road Map',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
    },
]

const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className="q-card">
            <div className="q-card-header" onClick={() => setOpen(o => !o)}>
                <span className="q-index">Q{index + 1}</span>
                <p className="q-question">{item.question}</p>
                <span className={`q-chevron ${open ? 'open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className="q-card-body">
                    <div className="q-section">
                        <span className="q-tag tag-intention">Intention</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className="q-section">
                        <span className="q-tag tag-answer">Model Answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className="roadmap-day">
        <div className="roadmap-day-header">
            <span className="day-badge">Day {day.day}</span>
            <h3>{day.focus}</h3>
        </div>
        <ul className="day-tasks">
            {day.tasks.map((task, i) => (
                <li key={i}>{task}</li>
            ))}
        </ul>
    </div>
)

const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const { report, getReportById, loading, getResumePdf, error } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId])

    if (loading) {
        return (
            <main className="loading-screen">
                <div className="loading-inner">
                    <div className="spinner" />
                    <p>Loading your interview plan...</p>
                </div>
            </main>
        )
    }

    if (error) {
        return (
            <main className="loading-screen">
                <div className="loading-inner">
                    <p className="error-text">{error}</p>
                    <button className="back-btn" onClick={() => navigate('/')}>Go Back</button>
                </div>
            </main>
        )
    }

    if (!report) return null

    const scoreLabel =
        report.matchScore >= 80 ? 'Strong match' :
        report.matchScore >= 60 ? 'Moderate match' : 'Needs improvement'

    const scoreClass =
        report.matchScore >= 80 ? 'score-high' :
        report.matchScore >= 60 ? 'score-mid' : 'score-low'

    return (
        <div className="interview-page">
            <div className="interview-layout">

                <nav className="interview-nav">
                    <div className="nav-top">
                        <button className="back-link" onClick={() => navigate('/')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                            Back
                        </button>
                        <p className="nav-section-label">Sections</p>
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`nav-item ${activeNav === item.id ? 'nav-item-active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => getResumePdf(interviewId)}
                        className="download-btn"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                        Download Resume
                    </button>
                </nav>

                <div className="layout-divider" />

                <main className="interview-content">
                    {activeNav === 'technical' && (
                        <section>
                            <div className="content-header">
                                <h2>Technical Questions</h2>
                                <span className="count-badge">{report.technicalQuestions.length}</span>
                            </div>
                            <div className="q-list">
                                {report.technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section>
                            <div className="content-header">
                                <h2>Behavioral Questions</h2>
                                <span className="count-badge">{report.behavioralQuestions.length}</span>
                            </div>
                            <div className="q-list">
                                {report.behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section>
                            <div className="content-header">
                                <h2>Preparation Road Map</h2>
                                <span className="count-badge">{report.preparationPlan.length} days</span>
                            </div>
                            <div className="roadmap-list">
                                {report.preparationPlan.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                <div className="layout-divider" />

                <aside className="interview-sidebar">
                    <div className="match-score-card">
                        <p className="sidebar-label">Match Score</p>
                        <div className={`score-ring ${scoreClass}`}>
                            <span className="score-value">{report.matchScore}</span>
                            <span className="score-pct">%</span>
                        </div>
                        <p className="score-label">{scoreLabel}</p>
                    </div>

                    <div className="sidebar-divider" />

                    <div className="skill-gaps-card">
                        <p className="sidebar-label">Skill Gaps</p>
                        <div className="skill-tags">
                            {report.skillGaps.map((gap, i) => (
                                <span key={i} className={`skill-tag severity-${gap.severity}`}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default Interview
