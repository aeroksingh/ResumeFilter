import { Link } from "react-router"

const featureItems = [
    {
        number: "01",
        title: "Instant AI feedback",
        description: "See how your experience lines up with the role and where to focus before interview day.",
        icon: <><path d="M12 3v3m0 12v3M3 12h3m12 0h3" /><circle cx="12" cy="12" r="6" /><path d="m10 12 1.3 1.3L14.5 10" /></>,
    },
    {
        number: "02",
        title: "Guidance shaped around you",
        description: "Get role-specific questions and answer guidance grounded in your resume and experience.",
        icon: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /><path d="M8 7h8m-8 4h6" /></>,
    },
    {
        number: "03",
        title: "A plan you can act on",
        description: "Turn skill gaps into a focused preparation roadmap, one practical step at a time.",
        icon: <><path d="M4 19V5m0 14h16" /><path d="m7 15 4-4 3 2 5-6" /><path d="M16 7h3v3" /></>,
    },
]

const testimonials = [
    {
        quote: "I finally knew which stories to prepare and what the hiring team might ask.",
        name: "Maya Chen",
        role: "Product designer",
        avatar: "https://i.pravatar.cc/96?img=47",
        className: "lg:-rotate-2",
    },
    {
        quote: "It turned a long job description into a preparation plan I could actually follow.",
        name: "Daniel Brooks",
        role: "Software engineer",
        avatar: "https://i.pravatar.cc/96?img=12",
        className: "lg:translate-y-8 lg:rotate-1",
    },
    {
        quote: "The tailored questions made my practice sessions feel much more focused.",
        name: "Aisha Patel",
        role: "Business analyst",
        avatar: "https://i.pravatar.cc/96?img=44",
        className: "lg:-rotate-1",
    },
]

function HomePage() {
    return (
        <main className="min-h-screen overflow-hidden bg-white font-[DM_Sans,sans-serif] text-slate-900">
            <header className="relative z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
                <nav aria-label="Main navigation" className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
                    <Link to="/" className="text-[21px] font-extrabold text-slate-900" aria-label="ResumeFilter home">
                        Resume<span className="text-teal-700">Filter</span>
                    </Link>
                    <Link to="/login" className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-700/20">
                        Login
                    </Link>
                </nav>
            </header>

            <section className="relative isolate overflow-hidden bg-[#f3f8fa]">
                <div className="absolute inset-y-0 right-0 -z-10 hidden w-1/3 border-l border-sky-100 bg-sky-50/70 lg:block" />
                <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[1fr_0.95fr] lg:gap-16 lg:px-12 lg:py-24">
                    <div className="relative z-10 max-w-2xl">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-3.5 py-2 text-xs font-semibold text-teal-900 shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-teal-600" />
                            A clearer path to your next role
                        </div>
                        <h1 className="max-w-2xl font-[Manrope,sans-serif] text-5xl font-extrabold leading-[1.06] text-slate-950 sm:text-6xl lg:text-[68px]">
                            Master your next interview <span className="text-teal-700">with AI.</span>
                        </h1>
                        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                            Bring your resume and a job description. Get tailored questions, thoughtful feedback, and a preparation plan built around you.
                        </p>
                        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Link to="/login" className="group inline-flex h-14 items-center justify-center gap-3 rounded-lg bg-teal-700 px-6 text-base font-bold text-white shadow-lg shadow-teal-900/15 transition hover:-translate-y-0.5 hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-700/25">
                                Build my interview plan
                                <svg aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
                            </Link>
                            <span className="text-sm text-slate-500">Free to get started <span className="px-1 text-slate-300">·</span> No credit card required</span>
                        </div>
                        <div className="mt-11 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-slate-200/80 pt-6 text-sm text-slate-600">
                            <span className="flex items-center gap-2"><svg className="h-4 w-4 text-teal-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.2 7.26a1 1 0 0 1-1.42 0l-3.8-3.83a1 1 0 0 1 1.42-1.41l3.09 3.11 6.49-6.54a1 1 0 0 1 1.414-.004Z" clipRule="evenodd" /></svg>Personalized to your role</span>
                            <span className="flex items-center gap-2"><svg className="h-4 w-4 text-teal-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.2 7.26a1 1 0 0 1-1.42 0l-3.8-3.83a1 1 0 0 1 1.42-1.41l3.09 3.11 6.49-6.54a1 1 0 0 1 1.414-.004Z" clipRule="evenodd" /></svg>Clear next steps</span>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-[570px] lg:ml-auto">
                        <div className="relative overflow-hidden rounded-[1.4rem] border-[7px] border-white bg-slate-200 shadow-[0_35px_90px_-35px_rgba(15,55,65,0.42)]">
                            <img
                                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85"
                                alt="Colleagues collaborating around a table"
                                className="aspect-[1.12/1] w-full object-cover object-center"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
                            <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-xl border border-white/50 bg-white/90 px-4 py-3 shadow-xl backdrop-blur">
                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-800">
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /><path d="M8 7h8m-8 4h6" /></svg>
                                </span>
                                <span><span className="block text-xs text-slate-500">Your prep roadmap</span><span className="block text-sm font-bold text-slate-900">Ready for the next step</span></span>
                            </div>
                        </div>
                        <div className="absolute -right-3 top-8 hidden rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-xl sm:block lg:-right-8">
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">✓</span>Role match analyzed</div>
                            <div className="mt-2 h-1.5 w-36 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[82%] rounded-full bg-teal-600" /></div>
                        </div>
                        <div className="absolute -bottom-7 right-5 hidden rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-xl sm:block lg:right-[-1.75rem]">
                            <p className="text-[11px] font-medium text-slate-500">Confidence comes from</p>
                            <p className="mt-1 text-sm font-bold text-slate-800">Practice with purpose</p>
                        </div>
                    </div>
                </div>
            </section>

            <section aria-label="Candidate community" className="border-y border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-5 px-5 py-7 text-center sm:px-8 md:flex-row md:gap-12 lg:px-12">
                    <p className="text-sm font-semibold text-slate-700">A little more prepared changes everything.</p>
                    <div className="hidden h-8 w-px bg-slate-200 md:block" />
                    <div className="flex flex-wrap items-center justify-center gap-x-9 gap-y-4">
                        <p className="text-sm text-slate-500"><strong className="text-xl font-extrabold text-slate-900">10,000+</strong><span className="ml-2">candidates preparing</span></p>
                        <p className="text-sm text-slate-500"><strong className="text-xl font-extrabold text-slate-900">98%</strong><span className="ml-2">would recommend it</span></p>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
                <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
                    <div className="max-w-md">
                        <p className="text-xs font-bold uppercase text-teal-700">A smarter way to prepare</p>
                        <h2 className="mt-4 font-[Manrope,sans-serif] text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl">Everything you need to walk in ready.</h2>
                        <p className="mt-5 leading-7 text-slate-600">Less guessing, more useful practice. ResumeFilter turns the role you want into a clear plan for how to get there.</p>
                        <Link to="/login" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-teal-800 transition hover:gap-3">
                            Start preparing <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {featureItems.map((feature) => (
                            <article key={feature.number} className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg hover:shadow-slate-900/5">
                                <div className="flex items-center justify-between">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-sky-50 text-teal-800 transition group-hover:bg-teal-700 group-hover:text-white">
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{feature.icon}</svg>
                                    </span>
                                    <span className="text-xs font-semibold text-slate-300">{feature.number}</span>
                                </div>
                                <h3 className="mt-6 text-base font-bold text-slate-900">{feature.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="overflow-hidden bg-[#eff6f8] py-20 sm:py-24">
                <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-xs font-bold uppercase text-teal-700">Real practice, better prepared</p>
                        <h2 className="mt-4 font-[Manrope,sans-serif] text-3xl font-extrabold text-slate-950 sm:text-4xl">Good preparation feels different.</h2>
                        <p className="mt-4 text-slate-600">A little structure can make a big difference in how you show up.</p>
                    </div>
                    <div className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
                        {testimonials.map((testimonial) => (
                            <figure key={testimonial.name} className={`relative rounded-2xl border border-white bg-white p-6 shadow-lg shadow-slate-900/8 transition duration-300 hover:-translate-y-1 ${testimonial.className}`}>
                                <div className="mb-5 flex gap-1 text-amber-500" aria-label="5 out of 5 stars">
                                    {Array.from({ length: 5 }, (_, index) => <span key={index} aria-hidden="true">★</span>)}
                                </div>
                                <blockquote className="min-h-24 text-[15px] leading-7 text-slate-700">“{testimonial.quote}”</blockquote>
                                <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                                    <img className="h-11 w-11 rounded-full object-cover ring-2 ring-sky-100" src={testimonial.avatar} alt="" loading="lazy" />
                                    <span><span className="block text-sm font-bold text-slate-900">{testimonial.name}</span><span className="mt-0.5 block text-xs text-slate-500">{testimonial.role}</span></span>
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
                <div className="flex flex-col items-start justify-between gap-7 rounded-2xl bg-slate-900 px-7 py-9 text-white shadow-xl shadow-slate-900/15 sm:flex-row sm:items-center sm:px-10 sm:py-11">
                    <div className="max-w-xl">
                        <p className="text-xs font-bold uppercase text-sky-300">Your next interview starts here</p>
                        <h2 className="mt-3 font-[Manrope,sans-serif] text-2xl font-extrabold sm:text-3xl">Make your preparation count.</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-300">Create a focused plan for the opportunity you want.</p>
                    </div>
                    <Link to="/login" className="inline-flex h-12 shrink-0 items-center justify-center rounded-lg bg-white px-5 text-sm font-bold text-slate-900 transition hover:bg-sky-100 focus:outline-none focus:ring-4 focus:ring-white/25">Get started <span className="ml-2" aria-hidden="true">→</span></Link>
                </div>
            </section>

            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
                    <Link to="/" className="font-extrabold text-slate-800">Resume<span className="text-teal-700">Filter</span></Link>
                    <p>Prepare with clarity. Show up with confidence.</p>
                    <Link to="/login" className="font-semibold text-slate-700 hover:text-teal-800">Login</Link>
                </div>
            </footer>

        </main>
    )
}

export default HomePage
