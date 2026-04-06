"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { searchRooms, getAllRooms, matchCategory, matchBroadCategories, CATEGORY_LABELS, QUICK_CATEGORIES } from "@/lib/building-data"
import { findShortestPath, findNearestByCategory } from "@/lib/pathfinding"
import type { Room } from "@/lib/building-data"
import type { Route } from "@/lib/pathfinding"
import { Building2, MapPin, Navigation, ArrowRightLeft, Trash2, Compass, ArrowUpDown } from "lucide-react"
import { FLOOR_LABELS } from "@/lib/prp-navigation-graph"

interface NavigationPanelProps {
  onStartSelected?: (nodeId: string) => void
  onEndSelected?: (nodeId: string) => void
  onRouteCalculated?: (route: Route) => void
  selectedRoute?: Route
}

// ── Stairs/Lift Choice Threshold (10-20% difference) ──
const CHOICE_THRESHOLD = 0.15 // 15%

export function NavigationPanel({
  onStartSelected,
  onEndSelected,
  onRouteCalculated,
  selectedRoute,
}: NavigationPanelProps) {
  const [startQuery, setStartQuery] = useState("")
  const [endQuery, setEndQuery] = useState("")
  const [selectedStart, setSelectedStart] = useState<Room | null>(null)
  const [selectedEnd, setSelectedEnd] = useState<Room | null>(null)
  const [showStartDropdown, setShowStartDropdown] = useState(false)
  const [showEndDropdown, setShowEndDropdown] = useState(false)
  const [nearestInfo, setNearestInfo] = useState<string | null>(null)
  const startRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (startRef.current && !startRef.current.contains(e.target as Node)) setShowStartDropdown(false)
      if (endRef.current && !endRef.current.contains(e.target as Node)) setShowEndDropdown(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const startResults = useMemo(() => {
    if (!startQuery) return getAllRooms().slice(0, 15)
    return searchRooms(startQuery).slice(0, 25)
  }, [startQuery])

  const endResults = useMemo(() => {
    if (!endQuery) return getAllRooms().slice(0, 15)
    return searchRooms(endQuery).slice(0, 25)
  }, [endQuery])

  // Group results by category
  const groupedEndResults = useMemo(() => {
    const groups: Record<string, Room[]> = {}
    for (const room of endResults) {
      const cat = room.category
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(room)
    }
    return groups
  }, [endResults])

  const handleStartSelect = (room: Room) => {
    setSelectedStart(room)
    setStartQuery(room.name)
    setShowStartDropdown(false)
    onStartSelected?.(room.id)
  }

  const handleEndSelect = (room: Room) => {
    setSelectedEnd(room)
    setEndQuery(room.name)
    setShowEndDropdown(false)
    onEndSelected?.(room.id)
  }

  const handleFindRoute = () => {
    if (!selectedStart || !selectedEnd) return
    const route = findShortestPath(selectedStart.id, selectedEnd.id)
    if (route) {
      setNearestInfo(null)
      onRouteCalculated?.(route)
    }
  }

  const handleFindNearest = (category: string) => {
    if (!selectedStart) return
    const catLabel = CATEGORY_LABELS[category]?.label ?? category
    const route = findNearestByCategory(selectedStart.id, category)
    if (route) {
      const dest = route.steps[route.steps.length - 1]
      setNearestInfo(`Nearest ${catLabel}: ${dest.nodeName} (${Math.round(route.totalDistance)} units)`)
      onRouteCalculated?.(route)
    } else {
      setNearestInfo(`No ${catLabel} found nearby`)
    }
  }

  const handleFindNearestBroad = (query: string) => {
    if (!selectedStart) return
    const cats = matchBroadCategories(query)
    if (cats.length === 0) return

    let bestRoute: Route | null = null
    let bestLabel = ""
    for (const cat of cats) {
      const route = findNearestByCategory(selectedStart.id, cat)
      if (route && (!bestRoute || route.totalDistance < bestRoute.totalDistance)) {
        bestRoute = route
        bestLabel = CATEGORY_LABELS[cat]?.label ?? cat
      }
    }
    if (bestRoute) {
      const dest = bestRoute.steps[bestRoute.steps.length - 1]
      setNearestInfo(`Nearest: ${dest.nodeName} — ${bestLabel} (${Math.round(bestRoute.totalDistance)} units)`)
      onRouteCalculated?.(bestRoute)
    }
  }

  const handleSwap = () => {
    const temp = selectedStart
    setSelectedStart(selectedEnd)
    setSelectedEnd(temp)
    setStartQuery(selectedEnd?.name || "")
    setEndQuery(temp?.name || "")
  }

  const handleClear = () => {
    setSelectedStart(null)
    setSelectedEnd(null)
    setStartQuery("")
    setEndQuery("")
    setNearestInfo(null)
  }

  // ── Determine via method (stairs vs lift) ─────
  const viaInfo = useMemo(() => {
    if (!selectedRoute || selectedRoute.floorChanges === 0) return null
    const steps = selectedRoute.steps
    // Find transition types used
    const transitionTypes = new Set<string>()
    for (const step of steps) {
      if (step.type === "stairs") transitionTypes.add("stairs")
      if (step.type === "elevator") transitionTypes.add("elevator")
    }
    if (transitionTypes.has("stairs") && !transitionTypes.has("elevator")) return { via: "Stairs", auto: true }
    if (transitionTypes.has("elevator") && !transitionTypes.has("stairs")) return { via: "Lift", auto: true }
    return { via: "Stairs & Lift", auto: true }
  }, [selectedRoute])

  // Floor label helper
  const getFloorLabel = (f: number) => FLOOR_LABELS[f] || `Floor ${f}`

  return (
    <div className="w-full p-5">
      {/* ── Header ────────────────────────────── */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Building2 className="w-5 h-5 text-slate-900" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Navigation</h2>
          <p className="text-xs text-slate-500">Find your way</p>
        </div>
      </div>

      {/* ── Start Location ────────────────────── */}
      <div className="mb-4">
        <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-300 mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          From
        </label>
        <div className="relative" ref={startRef}>
          <div className="relative flex items-center">
            <MapPin className="absolute left-3 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Select starting point..."
              value={startQuery}
              onChange={(e) => {
                setStartQuery(e.target.value)
                setShowStartDropdown(true)
              }}
              onFocus={() => setShowStartDropdown(true)}
              className="w-full pl-10 pr-3 py-2.5 border border-slate-600/50 rounded-xl bg-[#0f172a] text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 text-sm"
            />
          </div>

          {showStartDropdown && startResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1e293b] border border-slate-600/50 rounded-xl shadow-2xl z-20 max-h-60 overflow-y-auto">
              {startResults.map((room) => (
                <button
                  key={room.id}
                  onClick={() => handleStartSelect(room)}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-700/60 transition-colors duration-150 border-b border-slate-700/30 last:border-b-0"
                >
                  <div className="font-medium text-slate-100 text-sm">{room.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Block {room.block} · {getFloorLabel(room.floor)}</div>
                </button>
              ))}
            </div>
          )}
        </div>
        {selectedStart && (
          <div className="mt-2 text-xs text-emerald-400 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {selectedStart.name}
          </div>
        )}
      </div>

      {/* ── Quick Find Nearest ────────────────── */}
      {selectedStart && (
        <div className="mb-4">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
            <Compass className="w-3 h-3" />
            Find Nearest
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {QUICK_CATEGORIES.map((cat) => {
              const meta = CATEGORY_LABELS[cat]
              return (
                <button
                  key={cat}
                  onClick={() => handleFindNearest(cat)}
                  className="flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg bg-[#0f172a] border border-slate-700/50 hover:bg-cyan-900/20 hover:border-cyan-500/30 transition-all duration-200 text-center group"
                >
                  <span className="text-base group-hover:scale-110 transition-transform duration-200">{meta?.icon}</span>
                  <span className="text-[9px] text-slate-400 font-medium leading-tight">{meta?.label}</span>
                </button>
              )
            })}
          </div>
          {nearestInfo && (
            <div className="mt-2 text-xs text-amber-300 font-medium bg-amber-900/15 border border-amber-700/25 rounded-xl px-3 py-2">
              {nearestInfo}
            </div>
          )}
        </div>
      )}

      {/* ── Swap Button ──────────────────────── */}
      <div className="flex justify-center mb-4">
        <button
          onClick={handleSwap}
          disabled={!selectedStart || !selectedEnd}
          className="p-2 rounded-lg bg-[#0f172a] text-slate-500 hover:bg-cyan-900/20 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 border border-slate-700/50"
          title="Swap locations"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>
      </div>

      {/* ── End Location ─────────────────────── */}
      <div className="mb-5">
        <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-300 mb-2">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          To
        </label>
        <div className="relative" ref={endRef}>
          <div className="relative flex items-center">
            <MapPin className="absolute left-3 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Select destination..."
              value={endQuery}
              onChange={(e) => {
                setEndQuery(e.target.value)
                setShowEndDropdown(true)
                const cat = matchCategory(e.target.value)
                if (cat && selectedStart) {
                  handleFindNearest(cat)
                }
              }}
              onFocus={() => setShowEndDropdown(true)}
              className="w-full pl-10 pr-3 py-2.5 border border-slate-600/50 rounded-xl bg-[#0f172a] text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 text-sm"
            />
          </div>

          {showEndDropdown && endResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1e293b] border border-slate-600/50 rounded-xl shadow-2xl z-20 max-h-60 overflow-y-auto">
              {Object.entries(groupedEndResults).map(([cat, rooms]) => {
                const meta = CATEGORY_LABELS[cat]
                return (
                  <div key={cat}>
                    <div className="px-4 py-1.5 bg-[#0f172a]/80 text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0 border-b border-slate-700/30">
                      {meta?.icon ?? "📌"} {meta?.label ?? cat}
                    </div>
                    {rooms.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => handleEndSelect(room)}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-700/60 transition-colors duration-150 border-b border-slate-700/20 last:border-b-0"
                      >
                        <div className="font-medium text-slate-100 text-sm">{room.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Block {room.block} · {getFloorLabel(room.floor)}
                          {room.description && <span className="text-slate-600"> · {room.description}</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                )
              })}
            </div>
          )}
        </div>
        {selectedEnd && (
          <div className="mt-2 text-xs text-red-400 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            {selectedEnd.name}
          </div>
        )}
      </div>

      {/* ── Action Buttons ───────────────────── */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={handleFindRoute}
          disabled={!selectedStart || !selectedEnd}
          className="flex-1 py-2.5 px-4 glow-button bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-900 rounded-xl font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
        >
          <Navigation className="w-4 h-4" />
          Find Route
        </button>
        <button
          onClick={handleClear}
          className="px-3 py-2.5 bg-[#0f172a] text-slate-400 rounded-xl hover:bg-slate-700 hover:text-slate-200 transition-all duration-200 border border-slate-700/50"
          title="Clear selections"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* ── Route Details ────────────────────── */}
      {selectedRoute && (
        <div className="bg-gradient-to-br from-cyan-900/15 to-emerald-900/15 rounded-2xl p-4 border border-cyan-500/25">
          <h3 className="font-bold text-sm text-cyan-300 mb-3 flex items-center gap-2">
            <Navigation className="w-4 h-4" />
            Route Found
          </h3>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-[#0f172a]/60 rounded-xl p-2.5 text-center border border-slate-700/30">
              <div className="text-lg font-bold text-cyan-300">{Math.round(selectedRoute.totalDistance)}</div>
              <div className="text-[10px] text-slate-500 font-medium uppercase">Distance</div>
            </div>
            <div className="bg-[#0f172a]/60 rounded-xl p-2.5 text-center border border-slate-700/30">
              <div className="text-lg font-bold text-cyan-300">{selectedRoute.steps.length}</div>
              <div className="text-[10px] text-slate-500 font-medium uppercase">Steps</div>
            </div>
            <div className="bg-[#0f172a]/60 rounded-xl p-2.5 text-center border border-slate-700/30">
              <div className={`text-lg font-bold ${selectedRoute.floorChanges > 0 ? "text-amber-400" : "text-cyan-300"}`}>
                {selectedRoute.floorChanges}
              </div>
              <div className="text-[10px] text-slate-500 font-medium uppercase">Floors</div>
            </div>
          </div>

          {/* Via indicator */}
          {viaInfo && (
            <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-amber-500/8 border border-amber-500/20 rounded-xl">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="text-xs text-amber-300 font-medium">
                via {viaInfo.via}
                {viaInfo.auto && <span className="text-amber-500/70 ml-1">(fastest)</span>}
              </span>
            </div>
          )}

          {/* Directions */}
          <div className="bg-[#0f172a]/60 rounded-xl p-3 max-h-48 overflow-y-auto border border-slate-700/30">
            <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Directions</h4>
            <ol className="space-y-1.5 text-xs">
              {selectedRoute.steps.slice(0, 8).map((step, idx) => {
                const isFloorChange = idx > 0 && selectedRoute.steps[idx - 1].floor !== step.floor
                return (
                  <li key={idx} className={`flex gap-2 ${isFloorChange ? "pt-1.5 border-t border-amber-500/20" : ""}`}>
                    <span className={`font-bold flex-shrink-0 ${
                      isFloorChange ? "text-amber-400" :
                      idx === 0 ? "text-emerald-400" :
                      idx === selectedRoute.steps.length - 1 ? "text-red-400" :
                      "text-cyan-400"
                    }`}>{idx + 1}.</span>
                    <span className="text-slate-300">
                      <span className="font-medium">{step.instruction}</span>
                      <span className="text-slate-600 ml-1">({getFloorLabel(step.floor)})</span>
                    </span>
                  </li>
                )
              })}
              {selectedRoute.steps.length > 8 && (
                <li className="text-cyan-400 font-medium pt-1">...and {selectedRoute.steps.length - 8} more steps</li>
              )}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
