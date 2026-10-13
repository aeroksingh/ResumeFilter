import { useState } from "react"

const AppNavbar = ({ reports, user, onLogout, navigate }) => {
    const [query, setQuery] = useState("")
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const normalizedQuery = query.trim().toLowerCase()
    const results = normalizedQuery
        ? reports.filter((report) =>
            `${report.title || ""} ${report.jobDescription || ""}`.toLowerCase().includes(normalizedQuery)
        ).slice(0, 6)
        : reports.slice(0, 5)

    const handleLogout = async () => {
        await onLogout()
        navigate("/", { replace: true })
    }

    return (
        <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
            <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-5 px-4 sm:px-6 lg:px-8">
                <button
                    type="button"
                    className="flex shrink-0 items-center gap-2 text-left"
                    onClick={() => navigate("/planner")}
                    aria-label="ResumeFilter home"
                >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-sm font-bold text-white shadow-sm">R</span>
                    <span className="text-lg font-bold tracking-tight text-slate-900">Resume<span className="text-teal-700">Filter</span></span>
                </button>

                <div className="relative ml-auto w-full max-w-md">
                    <label className="sr-only" htmlFor="report-search">Search past plans</label>
                    <div className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-400 transition focus-within:border-teal-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-600/10">
                        <svg aria-hidden="true" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
                        <input
                            id="report-search"
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            onFocus={() => setIsSearchOpen(true)}
                            onKeyDown={(event) => {
                                if (event.key === "Escape") setIsSearchOpen(false)
                                if (event.key === "Enter" && results[0]) {
                                    navigate(`/interview/${results[0]._id}`)
                                    setIsSearchOpen(false)
                                }
                            }}
                            placeholder="Search past plans..."
                            className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                            autoComplete="off"
                        />
                        {query && (
                            <button type="button" className="text-xs font-medium text-slate-500 hover:text-slate-900" onClick={() => setQuery("")} aria-label="Clear search">
                                Clear
                            </button>
                        )}
                    </div>
                    {isSearchOpen && (query || reports.length > 0) && (
                        <>
                            <button type="button" aria-label="Close search results" className="fixed inset-0 z-10 cursor-default" onClick={() => setIsSearchOpen(false)} />
                            <div className="absolute inset-x-0 top-12 z-20 overflow-hidden rounded-xl border border-slate-200 bg-white py-2 shadow-xl shadow-slate-900/10">
                                <p className="px-4 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                    {normalizedQuery ? "Matching plans" : "Recent plans"}
                                </p>
                                {results.length ? results.map((report) => (
                                    <button
                                        type="button"
                                        key={report._id}
                                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-teal-50 focus:bg-teal-50 focus:outline-none"
                                        onClick={() => {
                                            navigate(`/interview/${report._id}`)
                                            setIsSearchOpen(false)
                                            setQuery("")
                                        }}
                                    >
                                        <span className="min-w-0">
                                            <span className="block truncate text-sm font-semibold text-slate-800">{report.title || "Untitled role"}</span>
                                            <span className="mt-0.5 block text-xs text-slate-500">{new Date(report.createdAt).toLocaleDateString()}</span>
                                        </span>
                                        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">{report.matchScore ?? "--"}%</span>
                                    </button>
                                )) : (
                                    <p className="px-4 py-4 text-sm text-slate-500">No saved plans match that search.</p>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <div className="flex shrink-0 items-center gap-3 border-l border-slate-200 pl-4">
                    <span className="hidden max-w-32 truncate text-sm font-medium text-slate-600 sm:block">{user?.username || "Your workspace"}</span>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-600/10"
                    >
                        <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></svg>
                        <span className="hidden sm:inline">Sign out</span>
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default AppNavbar
