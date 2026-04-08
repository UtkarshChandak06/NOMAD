import { useState, useEffect, useRef } from 'react'
import Sidebar from '../components/Sidebar'
import Icon from '../components/Icon'

/* ─── Animated counter hook ─── */
function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          let start = 0
          const step = target / (duration / 16)
          const timer = setInterval(() => {
            start += step
            if (start >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(start))
            }
          }, 16)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return { count, ref }
}

/* ─── Section fade-in hook ─── */
function useFadeIn() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

/* ─── Data ─── */
const skills = [
  {
    category: 'Programming',
    icon: 'code',
    color: '#0033A0',
    items: ['Python', 'C', 'C++', 'Java']
  },
  {
    category: 'Web Development',
    icon: 'language',
    color: '#FF9933',
    items: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js']
  },
  {
    category: 'Core Domains',
    icon: 'security',
    color: '#8E44AD',
    items: ['Information Security', 'AI / ML', 'IoT Systems']
  },
  {
    category: 'Tools & Platforms',
    icon: 'build',
    color: '#27AE60',
    items: ['VS Code', 'Git', 'GitHub', 'Antigravity', 'Arduino IDE']
  }
]

const projects = [
  {
    id: 'signify',
    title: 'SIGNIFY',
    subtitle: 'AI Sign Language Translator',
    icon: 'sign_language',
    color: '#FF9933',
    gradient: 'linear-gradient(135deg, #FF9933 0%, #FF6B00 100%)',
    problem: 'Bridges the communication gap between ASL users and non-signers by converting real-time hand gestures into text and speech — enabling seamless, barrier-free conversations.',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Python', 'Flask', 'OpenCV', 'MediaPipe', 'TensorFlow', 'WebSockets', 'Claude API'],
    features: [
      'Real-time gesture recognition at 10 FPS',
      'AI-powered sentence prediction & auto-complete',
      'Text-to-speech output for non-signers',
      'Sliding window filtering for stable predictions',
      'Works across varied lighting & backgrounds'
    ],
    contributions: [
      'Designed full frontend-backend architecture',
      'Built real-time WebSocket video pipeline',
      'Developed ML inference pipeline (63-dim vector input)',
      'Solved prediction instability with sliding window algorithm',
      'Integrated AI for intelligent word prediction'
    ],
    impact: [
      'Fast & stable real-time recognition',
      'Reduced user effort with AI-assisted completion',
      'Robust performance in real-world environments'
    ]
  },
  {
    id: 'iot-dashboard',
    title: 'ESP8266 Dashboard',
    subtitle: 'Offline Health & Environment Monitor',
    icon: 'developer_board',
    color: '#27AE60',
    gradient: 'linear-gradient(135deg, #27AE60 0%, #1E8449 100%)',
    problem: 'Provides real-time health and environmental monitoring without any internet dependency — ideal for remote clinics, field setups, and research labs.',
    stack: ['ESP8266', 'Arduino (C++)', 'DHT11', 'MAX30100', 'HTML/CSS/JS', 'AJAX'],
    features: [
      'Fully offline system — no cloud required',
      'Real-time web dashboard via Wi-Fi AP',
      'Dual output: LCD + Web UI',
      'ESP8266 acts as its own Wi-Fi Access Point',
      'Live sensor updates every second'
    ],
    contributions: [
      'Configured ESP8266 AP mode + embedded web server',
      'Integrated DHT11 (temp/humidity) & MAX30100 (heart rate/SpO₂)',
      'Built embedded, responsive web dashboard',
      'Implemented AJAX-based real-time data streaming',
      'Designed simulation logic for stable sensor readings'
    ],
    impact: [
      'Works in remote, no-internet environments',
      'Low-cost and portable health monitoring',
      'Useful for clinics, field setups, and labs'
    ]
  },
  {
    id: 'nomad',
    title: 'NOMAD',
    subtitle: 'AI Travel Planner & Assistant',
    icon: 'travel_explore',
    color: '#0033A0',
    gradient: 'linear-gradient(135deg, #0033A0 0%, #001F6D 100%)',
    problem: 'Simplifies travel planning by generating personalized AI itineraries, managing expenses, and centralizing travel information — all in one intelligent platform.',
    stack: ['React', 'Tailwind CSS', 'Node.js', 'Express', 'Groq API (LLaMA 3.3)', 'Context API'],
    features: [
      'Natural language trip input parsing',
      'AI-generated day-wise itineraries',
      'Expense tracking & budget analysis',
      'Destination explorer (25+ locations)',
      'Personalized 17-question behavioral planner'
    ],
    contributions: [
      'Built web application end-to-end',
      'Designed NLP-based natural language input parser',
      'Developed backend API proxy for AI inference',
      'Implemented full UI/UX design system',
      'Created fallback system for API reliability'
    ],
    impact: [
      'End-to-end AI-powered travel planning',
      'Supports multiple destinations & scenarios',
      'Reliable even when AI API fails'
    ]
  }
]

const timeline = [
  {
    period: '2023 – Present',
    title: 'B.Tech Computer Science (Information Security)',
    org: 'VIT — Vellore Institute of Technology',
    icon: 'school',
    description: 'Specializing in Information Security with coursework in AI/ML, Data Structures, Cryptography, and Network Security.'
  }
]

const navSections = [
  { id: 'hero', label: 'Home', icon: 'person' },
  { id: 'skills', label: 'Skills', icon: 'code' },
  { id: 'projects', label: 'Projects', icon: 'work' },
  { id: 'journey', label: 'Journey', icon: 'timeline' },
  { id: 'contact', label: 'Contact', icon: 'mail' },
]

export default function About() {
  const [activeSection, setActiveSection] = useState('hero')
  const [expandedProject, setExpandedProject] = useState(null)
  const [activeProjectTab, setActiveProjectTab] = useState({})

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = navSections.map(s => document.getElementById(s.id))
      const scrollPos = window.scrollY + 300

      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] && sections[i].offsetTop <= scrollPos) {
          setActiveSection(navSections[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const stat1 = useCountUp(3, 1500)
  const stat2 = useCountUp(8, 1500)
  const stat3 = useCountUp(5, 1500)

  const skillsFade = useFadeIn()
  const projectsFade = useFadeIn()
  const journeyFade = useFadeIn()
  const contactFade = useFadeIn()

  return (
    <div className="min-h-screen bg-[#fdf9f3] flex font-['Plus_Jakarta_Sans']">
      <Sidebar />

      {/* ─── Floating Mini Nav (Desktop) ─── */}
      <div className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-2">
        {navSections.map(s => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            title={s.label}
            className={`group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${activeSection === s.id
                ? 'bg-[#FF9933] text-white shadow-lg shadow-[#FF9933]/30 scale-110'
                : 'bg-white text-[#00257b]/40 border border-[#00257b]/5 hover:bg-[#FF9933]/10 hover:text-[#FF9933]'
              }`}
          >
            <Icon name={s.icon} className="text-lg" />
            <span className="absolute right-14 bg-[#0033A0] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap tracking-wider uppercase">
              {s.label}
            </span>
          </button>
        ))}
      </div>

      <main className="flex-1 lg:ml-64 overflow-y-auto">

        {/* ═══════════════════════════════════════════════
            SECTION 1 — HERO
        ═══════════════════════════════════════════════ */}
        <section id="hero" className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0033A0] via-[#001F6D] to-[#000D33]" />
          <div className="absolute inset-0 hero-pattern opacity-30" />

          {/* Floating Orbs */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#FF9933]/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#0033A0]/20 rounded-full blur-3xl" style={{ animation: 'pulse 4s ease-in-out infinite' }} />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-[#8E44AD]/10 rounded-full blur-2xl" style={{ animation: 'pulse 6s ease-in-out infinite' }} />

          <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-20 text-center">
            {/* Avatar + Badge */}
            <div className="relative inline-block mb-8">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-[#FF9933] to-[#FF6B00] p-1 mx-auto shadow-2xl shadow-[#FF9933]/30">
                <div className="w-full h-full rounded-full bg-[#001F6D] flex items-center justify-center">
                  <span className="text-5xl md:text-6xl font-['Noto_Serif'] font-black text-white">UC</span>
                </div>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FF9933] text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg whitespace-nowrap">
                Open to Work
              </div>
            </div>

            {/* Name */}
            <h1 className="font-['Noto_Serif'] text-4xl sm:text-5xl md:text-7xl font-black text-white mb-4 leading-tight tracking-tight">
              Utkarsh <span className="text-[#FF9933]">Chandak</span>
            </h1>

            {/* Subtitle */}
            <p className="text-white/40 text-xs sm:text-sm font-bold uppercase tracking-[0.3em] mb-8">
              Computer Science Engineer • Information Security
            </p>

            {/* Tagline */}
            <div className="max-w-3xl mx-auto mb-10">
              <p className="text-lg sm:text-xl md:text-2xl text-white/70 font-medium leading-relaxed">
                Building <span className="text-[#FF9933] font-bold">AI-powered</span>, <span className="text-white font-bold">secure</span>, and <span className="text-[#27AE60] font-bold">real-time</span> systems across Web, IoT, and Machine Learning.
              </p>
            </div>

            {/* About Paragraph */}
            <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 sm:p-8 mb-10">
              <p className="text-white/60 text-sm sm:text-base leading-relaxed font-medium">
                I am a Computer Science undergraduate specializing in <strong className="text-white/90">Information Security</strong> at VIT. I focus on building intelligent, real-world systems that combine <strong className="text-white/90">AI, web technologies, and embedded hardware</strong>. My work spans gesture recognition, offline IoT systems, and AI-driven applications — with an emphasis on performance, reliability, and usability.
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-10">
              <div ref={stat1.ref} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                <p className="text-3xl md:text-4xl font-black text-[#FF9933]">{stat1.count}+</p>
                <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mt-1">Projects</p>
              </div>
              <div ref={stat2.ref} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                <p className="text-3xl md:text-4xl font-black text-white">{stat2.count}+</p>
                <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mt-1">Technologies</p>
              </div>
              <div ref={stat3.ref} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                <p className="text-3xl md:text-4xl font-black text-[#27AE60]">{stat3.count}+</p>
                <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mt-1">Domains</p>
              </div>
            </div>

            {/* Scroll CTA */}
            <button
              onClick={() => scrollTo('skills')}
              className="inline-flex items-center gap-2 bg-[#FF9933] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#FF6B00] transition-all active:scale-95 shadow-xl shadow-[#FF9933]/30 group"
            >
              Explore My Work
              <Icon name="arrow_downward" className="group-hover:translate-y-1 transition-transform" />
            </button>
          </div>

          {/* Bottom Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 60L48 52C96 44 192 28 288 24C384 20 480 28 576 40C672 52 768 68 864 72C960 76 1056 68 1152 56C1248 44 1344 28 1392 20L1440 12V120H0V60Z" fill="#fdf9f3" />
            </svg>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 2 — SKILLS
        ═══════════════════════════════════════════════ */}
        <section
          id="skills"
          ref={skillsFade.ref}
          className={`py-20 sm:py-28 px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${skillsFade.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-[10px] font-black text-[#FF9933] uppercase tracking-[0.4em] mb-3">What I Work With</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-['Noto_Serif'] font-black text-[#0033A0] mb-4">Skills & Technologies</h2>
              <p className="text-[#00257b]/50 font-medium max-w-xl mx-auto">A versatile toolkit spanning systems programming, modern web frameworks, AI/ML pipelines, and embedded IoT hardware.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {skills.map((skill, i) => (
                <div
                  key={skill.category}
                  className="bg-white p-6 sm:p-8 rounded-[2rem] border border-[#00257b]/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: `${skill.color}10` }}
                    >
                      <Icon name={skill.icon} className="text-xl" style={{ color: skill.color }} />
                    </div>
                    <h3 className="font-bold text-[#0033A0] text-lg">{skill.category}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skill.items.map(item => (
                      <span
                        key={item}
                        className="bg-[#fdf9f3] text-[#0033A0] text-xs font-bold px-4 py-2 rounded-xl border border-[#00257b]/5 group-hover:border-[#FF9933]/20 transition-colors"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 3 — PROJECTS
        ═══════════════════════════════════════════════ */}
        <section
          id="projects"
          ref={projectsFade.ref}
          className={`py-20 sm:py-28 px-6 sm:px-8 lg:px-12 bg-gradient-to-b from-[#fdf9f3] via-white to-[#fdf9f3] transition-all duration-1000 ${projectsFade.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-[10px] font-black text-[#FF9933] uppercase tracking-[0.4em] mb-3">Featured Work</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-['Noto_Serif'] font-black text-[#0033A0] mb-4">Projects</h2>
              <p className="text-[#00257b]/50 font-medium max-w-xl mx-auto">Real-world systems built from the ground up — spanning AI, IoT, and web development.</p>
            </div>

            <div className="space-y-8">
              {projects.map((project, idx) => {
                const isExpanded = expandedProject === project.id
                const currentTab = activeProjectTab[project.id] || 'features'

                return (
                  <div
                    key={project.id}
                    className="bg-white rounded-[2.5rem] border border-[#00257b]/5 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
                    style={{ transitionDelay: `${idx * 150}ms` }}
                  >
                    {/* Project Header */}
                    <div
                      className="p-6 sm:p-8 cursor-pointer group"
                      onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                        <div
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
                          style={{ background: project.gradient }}
                        >
                          <Icon name={project.icon} className="text-2xl sm:text-3xl text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl sm:text-2xl font-['Noto_Serif'] font-black text-[#0033A0]">{project.title}</h3>
                            <span className="hidden sm:inline text-[9px] font-black uppercase tracking-widest bg-[#fdf9f3] text-[#00257b]/40 px-3 py-1 rounded-full border border-[#00257b]/5">
                              {project.id === 'nomad' ? 'This App' : 'Completed'}
                            </span>
                          </div>
                          <p className="text-[#00257b]/50 font-bold text-sm">{project.subtitle}</p>
                        </div>

                        <div className={`w-8 h-8 rounded-full bg-[#fdf9f3] flex items-center justify-center transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-180' : ''}`}>
                          <Icon name="expand_more" className="text-[#00257b]/40" />
                        </div>
                      </div>

                      {/* Problem Statement */}
                      <p className="text-[#00257b]/60 font-medium text-sm leading-relaxed mt-4 max-w-3xl">
                        {project.problem}
                      </p>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-2 mt-5">
                        {project.stack.map(tech => (
                          <span
                            key={tech}
                            className="text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-colors"
                            style={{
                              borderColor: `${project.color}20`,
                              color: project.color,
                              backgroundColor: `${project.color}08`
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <div className={`transition-all duration-500 overflow-hidden ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="px-6 sm:px-8 pb-8 border-t border-[#00257b]/5">
                        {/* Tabs */}
                        <div className="flex gap-1 mt-6 mb-6 bg-[#fdf9f3] p-1 rounded-2xl inline-flex">
                          {[
                            { key: 'features', label: 'Features', icon: 'stars' },
                            { key: 'contributions', label: 'My Role', icon: 'engineering' },
                            { key: 'impact', label: 'Impact', icon: 'trending_up' }
                          ].map(tab => (
                            <button
                              key={tab.key}
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveProjectTab({ ...activeProjectTab, [project.id]: tab.key })
                              }}
                              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${currentTab === tab.key
                                  ? 'bg-white text-[#0033A0] shadow-sm'
                                  : 'text-[#00257b]/40 hover:text-[#00257b]/60'
                                }`}
                            >
                              <Icon name={tab.icon} className="text-sm" />
                              <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                          ))}
                        </div>

                        {/* Tab Content */}
                        <div className="space-y-3">
                          {project[currentTab]?.map((item, i) => (
                            <div key={i} className="flex items-start gap-3 bg-[#fdf9f3] p-4 rounded-2xl border border-[#00257b]/5">
                              <div
                                className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                                style={{ backgroundColor: `${project.color}15` }}
                              >
                                <Icon
                                  name={currentTab === 'features' ? 'check' : currentTab === 'contributions' ? 'arrow_forward' : 'bolt'}
                                  className="text-xs"
                                  style={{ color: project.color }}
                                />
                              </div>
                              <p className="text-sm text-[#00257b]/70 font-medium leading-relaxed">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 4 — JOURNEY / EXPERIENCE
        ═══════════════════════════════════════════════ */}
        <section
          id="journey"
          ref={journeyFade.ref}
          className={`py-20 sm:py-28 px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${journeyFade.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-[10px] font-black text-[#FF9933] uppercase tracking-[0.4em] mb-3">Background</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-['Noto_Serif'] font-black text-[#0033A0] mb-4">My Journey</h2>
              <p className="text-[#00257b]/50 font-medium max-w-xl mx-auto">Education and experience shaping my path in technology.</p>
            </div>

            {/* Timeline */}
            <div className="relative max-w-3xl mx-auto">
              {/* Vertical Line */}
              <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#FF9933] via-[#0033A0] to-transparent" />

              <div className="space-y-8">
                {timeline.map((item, i) => (
                  <div key={i} className="relative flex gap-6 sm:gap-8 group">
                    {/* Dot */}
                    <div className="relative z-10 shrink-0">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white border-2 border-[#FF9933]/30 flex items-center justify-center shadow-lg shadow-[#FF9933]/10 group-hover:border-[#FF9933] group-hover:shadow-[#FF9933]/20 transition-all">
                        <Icon name={item.icon} className="text-xl sm:text-2xl text-[#FF9933]" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-[#00257b]/5 shadow-sm flex-1 hover:shadow-lg transition-all group-hover:-translate-y-0.5">
                      <span className="text-[10px] font-black text-[#FF9933] uppercase tracking-widest">{item.period}</span>
                      <h3 className="text-lg sm:text-xl font-bold text-[#0033A0] mt-2 mb-1">{item.title}</h3>
                      <p className="text-sm font-bold text-[#00257b]/40 mb-3">{item.org}</p>
                      <p className="text-sm text-[#00257b]/60 font-medium leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements / Certifications */}
            <div className="mt-20 max-w-3xl mx-auto">
              <h3 className="text-2xl font-['Noto_Serif'] font-bold text-[#0033A0] mb-8 text-center">Achievements & Interests</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: 'emoji_events', title: 'Project Builder', desc: 'Built 3+ production-grade projects across AI, web, and IoT domains', color: '#FF9933' },
                  { icon: 'shield', title: 'InfoSec Focus', desc: 'Specializing in Information Security with real-world security applications', color: '#0033A0' },
                  { icon: 'psychology', title: 'AI Enthusiast', desc: 'Applied ML/DL in gesture recognition, NLP, and intelligent travel planning', color: '#8E44AD' },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-[1.5rem] border border-[#00257b]/5 shadow-sm hover:shadow-lg transition-all text-center group hover:-translate-y-1">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${item.color}10` }}
                    >
                      <Icon name={item.icon} className="text-2xl" style={{ color: item.color }} filled />
                    </div>
                    <h4 className="font-bold text-[#0033A0] mb-2">{item.title}</h4>
                    <p className="text-xs text-[#00257b]/50 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 5 — CONTACT
        ═══════════════════════════════════════════════ */}
        <section
          id="contact"
          ref={contactFade.ref}
          className={`relative py-20 sm:py-28 px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${contactFade.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
          <div className="max-w-5xl mx-auto">
            <div className="relative bg-gradient-to-br from-[#0033A0] via-[#001F6D] to-[#000D33] rounded-[3rem] p-8 sm:p-12 lg:p-16 overflow-hidden">
              {/* Background Decorations */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9933]/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#0033A0]/20 rounded-full blur-3xl" />

              <div className="relative z-10 text-center">
                <p className="text-[10px] font-black text-[#FF9933] uppercase tracking-[0.4em] mb-3">Get In Touch</p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-['Noto_Serif'] font-black text-white mb-4">Let's Connect</h2>
                <p className="text-white/50 font-medium max-w-lg mx-auto mb-10">
                  I'm always interested in discussing new projects, creative ideas, or opportunities to be part of something amazing.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <a
                    href="mailto:utkarsh.chandak2024@vitstudent.ac.in"
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-[#FF9933]/30 transition-all group"
                  >
                    <Icon name="mail" className="text-3xl text-[#FF9933] mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-white font-bold text-sm mb-1">Email</p>
                    <p className="text-white/30 text-[10px] font-bold break-all">utkarsh.chandak2024@vitstudent.ac.in</p>
                  </a>

                  <a
                    href="https://github.com/UtkarshChandak06"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-[#FF9933]/30 transition-all group"
                  >
                    <Icon name="code" className="text-3xl text-white mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-white font-bold text-sm mb-1">GitHub</p>
                    <p className="text-white/30 text-[10px] font-bold">UtkarshChandak06</p>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/utkarsh-chandak-ba4811204"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-[#FF9933]/30 transition-all group"
                  >
                    <Icon name="work" className="text-3xl text-[#0077B5] mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-white font-bold text-sm mb-1">LinkedIn</p>
                    <p className="text-white/30 text-[10px] font-bold">utkarsh-chandak</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Footer ─── */}
        <footer className="py-12 text-center border-t border-[#00257b]/5 mx-6 sm:mx-8 lg:mx-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-lg font-['Noto_Serif'] font-black text-[#0033A0]">Utkarsh Chandak</span>
            <span className="text-[#00257b]/20">•</span>
            <span className="text-xs font-bold text-[#00257b]/30 uppercase tracking-widest">24BCI0156</span>
          </div>
          <p className="text-[#FF9933]/50 text-[10px] font-black uppercase tracking-[0.3em]">
            Built with React • Designed with ❤️
          </p>
        </footer>

      </main>
    </div>
  )
}
