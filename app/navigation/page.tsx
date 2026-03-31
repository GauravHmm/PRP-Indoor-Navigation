"use client"

import { useState } from "react"
import Link from "next/link"
import { BuildingMap } from "@/components/building-map"
import { NavigationPanel } from "@/components/navigation-panel"
import { Button } from "@/components/ui/button"
import type { Route } from "@/lib/pathfinding"
import { ArrowLeft, MapPin, Compass, Zap } from "lucide-react"

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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Portfolio
              </Button>
            </Link>
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Indoor Navigation System
              </h1>
              <p className="text-sm text-slate-400 mt-1">VIT PRP Academic Block</p>
            </div>
            <div className="w-32" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Search Panel - Left Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl border border-slate-600 shadow-2xl overflow-hidden">
                <NavigationPanel
                  onStartSelected={handleStartSelected}
                  onEndSelected={handleEndSelected}
                  onRouteCalculated={handleRouteCalculated}
                  selectedRoute={selectedRoute || undefined}
                />
              </div>
            </div>
          </div>

          {/* Map Display - Main Content */}
          <div className="lg:col-span-9">
            <BuildingMap
              startFloor={1}
              highlightedPath={selectedRoute?.steps}
              selectedStart={selectedStart || undefined}
              selectedEnd={selectedEnd || undefined}
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl border border-slate-600 p-6 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/20 transition-all">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-slate-100 mb-2">Real Floor Plans</h3>
            <p className="text-sm text-slate-400">
              Accurate building layouts with precise room positions and corridor connections.
            </p>
          </div>

          <div className="group bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl border border-slate-600 p-6 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/20 transition-all">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-slate-100 mb-2">Smart Routing</h3>
            <p className="text-sm text-slate-400">
              Intelligent pathfinding that finds optimal routes across multiple floors.
            </p>
          </div>

          <div className="group bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl border border-slate-600 p-6 hover:border-teal-500 hover:shadow-xl hover:shadow-teal-500/20 transition-all">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-slate-100 mb-2">Visual Guidance</h3>
            <p className="text-sm text-slate-400">
              Step-by-step directions with highlighted paths on the map for easy navigation.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
