import Link from "next/link"
import { ArrowRight, MapPin, Zap, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Portfolio() {
  const blocks = [
    {
      id: "A",
      name: "Block A",
      description: "Classrooms and Computing Labs",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "B",
      name: "Block B",
      description: "Research & Advanced Labs",
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "C",
      name: "Block C",
      description: "Faculty Offices & Admin",
      color: "from-amber-500 to-amber-600",
    },
    {
      id: "D",
      name: "Block D",
      description: "Seminar Halls & Facilities",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      id: "E",
      name: "Block E",
      description: "Support Services",
      color: "from-cyan-500 to-cyan-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-bold text-xl bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Gaurav
          </div>
          <div className="flex items-center gap-6">
            <a href="#about" className="text-slate-700 hover:text-blue-600 transition font-medium">
              About
            </a>
            <a href="#features" className="text-slate-700 hover:text-blue-600 transition font-medium">
              Features
            </a>
            <Link href="/navigation">
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:shadow-lg">
                Open App
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
            Navigate Your Campus{" "}
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">with Ease</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            An intelligent indoor navigation system for the VIT PRP Academic Block. Find classrooms, labs, and offices
            instantly with turn-by-turn directions powered by advanced pathfinding algorithms.
          </p>
          <Link href="/navigation">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:shadow-xl group">
              Explore the System
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition" />
            </Button>
          </Link>
        </div>
      </section>

      {/* PRP Building Section */}
      <section className="bg-white/50 backdrop-blur-sm py-20 md:py-32 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">VIT PRP Academic Complex</h2>
          <p className="text-lg text-slate-600 mb-12 max-w-2xl">
            A sprawling modern facility featuring 5 interconnected sub-blocks arranged around a central courtyard.
          </p>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Building Image */}
            <div className="relative">
              <img
                src="/images/prp.webp"
                alt="VIT PRP Academic Block aerial view"
                className="rounded-2xl shadow-2xl w-full h-auto border border-slate-200"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none" />
            </div>

            {/* Block Grid */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-8">Five Academic Blocks</h3>
              <div className="grid grid-cols-2 gap-4">
                {blocks.map((block) => (
                  <div
                    key={block.id}
                    className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-slate-300 transition-all cursor-pointer"
                  >
                    <div
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${block.color} text-white mb-3 group-hover:scale-110 transition-transform`}
                    >
                      <span className="font-bold text-lg">{block.id}</span>
                    </div>
                    <h4 className="font-semibold text-slate-900">{block.name}</h4>
                    <p className="text-sm text-slate-600 mt-2">{block.description}</p>
                  </div>
                ))}
              </div>

              <Link href="/navigation" className="block mt-8">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:shadow-lg">
                  Start Navigating
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-slate-900 mb-12">About This Project</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  1
                </span>
                The Challenge
              </h3>
              <p className="text-slate-600 leading-relaxed">
                The PRP Academic Block is a sprawling complex with 5 interconnected sub-blocks and multiple floors.
                Students and visitors struggle to navigate efficiently, wasting time looking for classrooms, labs, and
                offices.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold">
                  2
                </span>
                The Solution
              </h3>
              <p className="text-slate-600 leading-relaxed">
                An intelligent web-based navigation system with real-time mapping, advanced pathfinding, and
                turn-by-turn directions. Users search for any location and instantly receive optimal routes with visual
                guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white/50 backdrop-blur-sm py-20 md:py-32 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-slate-900 mb-16 text-center">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-xl border border-slate-200 p-8 hover:shadow-lg hover:border-blue-200 transition-all">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Interactive Maps</h3>
              <p className="text-slate-600">
                Visual floor plans with color-coded locations showing exactly where to go with real-time path
                highlighting.
              </p>
            </div>

            <div className="group bg-white rounded-xl border border-slate-200 p-8 hover:shadow-lg hover:border-teal-200 transition-all">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-100 to-teal-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Smart Routing</h3>
              <p className="text-slate-600">
                Advanced A* pathfinding algorithm calculates optimal routes considering distance, floor changes, and
                building layout.
              </p>
            </div>

            <div className="group bg-white rounded-xl border border-slate-200 p-8 hover:shadow-lg hover:border-blue-200 transition-all">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Search className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Smart Search</h3>
              <p className="text-slate-600">
                Instantly find any classroom, lab, office, or facility with powerful full-text search and autocomplete.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Built With Modern Tech</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "Next.js", desc: "React Framework" },
              { name: "TypeScript", desc: "Type Safety" },
              { name: "Tailwind CSS", desc: "Modern Styling" },
              { name: "A* Algorithm", desc: "Pathfinding" },
            ].map((tech) => (
              <div
                key={tech.name}
                className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all text-center"
              >
                <h3 className="font-bold text-slate-900 mb-2">{tech.name}</h3>
                <p className="text-sm text-slate-600">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 py-20 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Navigate?</h2>
          <p className="text-xl text-blue-50 mb-8">
            Experience the future of campus navigation with our intelligent indoor wayfinding system.
          </p>
          <Link href="/navigation">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-blue-50 group font-semibold"
            >
              Open Navigation System
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-12 text-center text-slate-600 text-sm">
          <p className="font-semibold text-slate-900 mb-2">Indoor Navigation System</p>
          <p>VIT PRP Academic Block • Designed & Built by Gaurav</p>
        </div>
      </footer>
    </div>
  )
}
