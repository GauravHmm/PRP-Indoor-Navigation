"use client"

import { useState } from "react"
import Link from "next/link"
import { BuildingMap } from "@/components/building-map"
import { NavigationPanel } from "@/components/navigation-panel"
import type { Route } from "@/lib/pathfinding"
import { ArrowLeft } from "lucide-react"

export default function NavigationApp() {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [selectedStart, setSelectedStart] = useState<string | null>(null)
  const [selectedEnd, setSelectedEnd] = useState<string | null>(null)

  const handleStartSelected = (nodeId: string) => {
    setSelectedStart(nodeId)
  }

  const handleEndSelected = (nodeId: string) => {
    setSelectedEnd(nodeId)
  }

  const handleRouteCalculated = (route: Route) => {
    setSelectedRoute(route)
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e]">
      {/* ── Header ─────────────────────────────── */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0f172a]/85 border-b border-slate-700/40 shadow-xl shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/">
              <button className="flex items-center gap-2 px-3 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-all duration-200 text-sm font-medium">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
            </Link>
            <div className="flex-1 text-center">
              <h1 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent tracking-tight">
                Indoor Navigation
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">VIT PRP Academic Block</p>
            </div>
            <div className="w-16 sm:w-24" />
          </div>
        </div>
      </header>

      {/* ── Main Content ───────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Search Panel — Left Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-20">
              <div className="glass-panel overflow-hidden">
                <NavigationPanel
                  onStartSelected={handleStartSelected}
                  onEndSelected={handleEndSelected}
                  onRouteCalculated={handleRouteCalculated}
                  selectedRoute={selectedRoute || undefined}
                />
              </div>
            </div>
          </div>

          {/* Map Display — Main Content */}
          <div className="lg:col-span-9">
            <BuildingMap
              startFloor={1}
              highlightedPath={selectedRoute?.steps}
              selectedStart={selectedStart || undefined}
              selectedEnd={selectedEnd || undefined}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
