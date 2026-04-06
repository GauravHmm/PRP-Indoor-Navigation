import Link from "next/link"
import { ArrowRight, MapPin, Zap, Search, Navigation, Layers, Building2 } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen animate-gradient-bg text-slate-100">
      {/* ── Navbar ──────────────────────────────────── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0f172a]/80 border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-extrabold text-xl bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent tracking-tight">
            PRP Navigator
          </div>
          <div className="flex items-center gap-6">
            <a href="#about" className="text-slate-400 hover:text-white transition-colors duration-200 font-medium text-sm hidden sm:block">
              About
            </a>
            <a href="#features" className="text-slate-400 hover:text-white transition-colors duration-200 font-medium text-sm hidden sm:block">
              Features
            </a>
            <Link href="/navigation">
              <button className="glow-button px-5 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-900 rounded-xl font-bold text-sm">
                Open App
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ───────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-[85vh] px-6 py-20 text-center overflow-hidden">
        {/* Subtle decorative orbs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="animate-reveal inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-sm font-semibold text-cyan-400 mb-8">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          VIT PRP Academic Block
        </div>

        <h1 className="animate-reveal-delay-1 text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] max-w-4xl mb-6">
          Navigate Your Campus{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Intelligently
          </span>
        </h1>

        <p className="animate-reveal-delay-2 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed mb-10">
          An intelligent indoor navigation system with graph-based pathfinding,
          multi-floor routing, and real-time visual guidance — find any room in seconds.
        </p>

        <Link href="/navigation" className="animate-reveal-delay-3">
          <button className="glow-button group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-900 rounded-2xl font-bold text-lg">
            Start Navigation
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </Link>

        {/* Subtle building hint */}
        <div className="mt-16 opacity-[0.08] pointer-events-none select-none">
          <svg width="600" height="120" viewBox="0 0 600 120" fill="none">
            {/* Abstract hex shapes suggesting building layout */}
            <polygon points="150,10 190,30 190,80 150,100 110,80 110,30" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <polygon points="300,20 340,40 340,80 300,100 260,80 260,40" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <polygon points="450,10 490,30 490,80 450,100 410,80 410,30" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <line x1="190" y1="55" x2="260" y2="55" stroke="currentColor" strokeWidth="1" />
            <line x1="340" y1="55" x2="410" y2="55" stroke="currentColor" strokeWidth="1" />
            <rect x="265" y="95" width="30" height="25" rx="3" stroke="currentColor" strokeWidth="1" fill="none" transform="rotate(45, 280, 107)" />
            <rect x="365" y="95" width="30" height="25" rx="3" stroke="currentColor" strokeWidth="1" fill="none" transform="rotate(-45, 380, 107)" />
          </svg>
        </div>
      </section>

      {/* ── About Section ──────────────────────────── */}
      <section id="about" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center tracking-tight">
            About This Project
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-panel p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-lg bg-cyan-500/15 flex items-center justify-center text-cyan-400 font-bold text-sm">1</span>
                <h3 className="text-lg font-bold text-white">The Challenge</h3>
              </div>
              <p className="text-slate-400 leading-relaxed">
                The PRP Academic Block is a sprawling complex with 5 interconnected sub-blocks and multiple floors. Students and visitors struggle to navigate efficiently, wasting time looking for classrooms, labs, and offices.
              </p>
            </div>

            <div className="glass-panel p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 font-bold text-sm">2</span>
                <h3 className="text-lg font-bold text-white">The Solution</h3>
              </div>
              <p className="text-slate-400 leading-relaxed">
                A web-based navigation system with real-time mapping, A* pathfinding across multiple floors, and turn-by-turn directions. Search for any location and get optimal routes with visual guidance instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Building Blocks Section ────────────────── */}
      <section className="py-16 md:py-24 border-y border-slate-700/30">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center tracking-tight">
            VIT PRP Academic Complex
          </h2>
          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto text-center">
            5 interconnected blocks arranged around a central courtyard
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-3xl mx-auto">
            {[
              { id: "A", color: "from-emerald-500 to-emerald-600", desc: "Labs & Computing" },
              { id: "B", color: "from-amber-500 to-amber-600", desc: "Research" },
              { id: "C", color: "from-blue-500 to-blue-600", desc: "Central Hub" },
              { id: "D", color: "from-amber-500 to-orange-600", desc: "Facilities" },
              { id: "E", color: "from-rose-500 to-rose-600", desc: "Classrooms" },
            ].map((block) => (
              <div key={block.id} className="glass-panel p-4 text-center hover:border-slate-500/80 transition-all duration-300 group">
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${block.color} text-white mb-3 group-hover:scale-110 transition-transform duration-200`}>
                  <span className="font-bold text-lg">{block.id}</span>
                </div>
                <h4 className="font-semibold text-sm text-white">Block {block.id}</h4>
                <p className="text-xs text-slate-500 mt-1">{block.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Link href="/navigation">
              <button className="glow-button group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-900 rounded-xl font-bold">
                Start Navigating
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features Section ──────────────────────── */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center tracking-tight">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <MapPin className="w-6 h-6 text-cyan-400" />,
                bg: "bg-cyan-500/10",
                title: "Interactive Maps",
                desc: "Zoomable SVG floor plans with color-coded rooms, corridors, and facilities. Real-time path overlay with smooth animations.",
                border: "hover:border-cyan-500/40",
              },
              {
                icon: <Zap className="w-6 h-6 text-emerald-400" />,
                bg: "bg-emerald-500/10",
                title: "Smart Routing",
                desc: "A* pathfinding finds optimal routes across multiple floors. Dijkstra's algorithm locates the nearest facility instantly.",
                border: "hover:border-emerald-500/40",
              },
              {
                icon: <Search className="w-6 h-6 text-violet-400" />,
                bg: "bg-violet-500/10",
                title: "Instant Search",
                desc: "Full-text search for any classroom, lab, office, or washroom. Auto-find nearest facilities with one tap.",
                border: "hover:border-violet-500/40",
              },
            ].map((f, i) => (
              <div key={i} className={`glass-panel p-8 transition-all duration-300 ${f.border} hover:shadow-xl group`}>
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ─────────────────────────────── */}
      <section className="py-16 border-t border-slate-700/30">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-white mb-8 text-center tracking-tight">Built With</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Next.js", icon: <Layers className="w-5 h-5" /> },
              { name: "TypeScript", icon: <Building2 className="w-5 h-5" /> },
              { name: "Tailwind CSS", icon: <Navigation className="w-5 h-5" /> },
              { name: "A* Algorithm", icon: <Zap className="w-5 h-5" /> },
            ].map((t) => (
              <div key={t.name} className="glass-panel p-4 text-center hover:border-slate-500/80 transition-all duration-200">
                <div className="flex items-center justify-center text-cyan-400 mb-2">{t.icon}</div>
                <h3 className="font-semibold text-sm text-white">{t.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">Ready to Navigate?</h2>
          <p className="text-lg text-slate-400 mb-10">
            Experience the future of campus navigation with intelligent indoor wayfinding.
          </p>
          <Link href="/navigation">
            <button className="glow-button group flex items-center gap-2 mx-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-900 rounded-2xl font-bold text-lg">
              Open Navigation System
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────── */}
      <footer className="border-t border-slate-700/30 py-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="font-semibold text-white text-sm mb-1">Indoor Navigation System</p>
          <p className="text-slate-500 text-sm">VIT PRP Academic Block · Designed & Built by Gaurav</p>
        </div>
      </footer>
    </div>
  )
}
