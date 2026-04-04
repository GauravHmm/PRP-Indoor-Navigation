"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { searchRooms, getAllRooms, matchCategory, matchBroadCategories, CATEGORY_LABELS, QUICK_CATEGORIES } from "@/lib/building-data"
import { findShortestPath, findNearestByCategory } from "@/lib/pathfinding"
import type { Room } from "@/lib/building-data"
import type { Route } from "@/lib/pathfinding"
import { Building2, MapPin, Navigation, ArrowRightLeft, Trash2, Compass } from "lucide-react"

interface NavigationPanelProps {
  onStartSelected?: (nodeId: string) => void
  onEndSelected?: (nodeId: string) => void
  onRouteCalculated?: (route: Route) => void
  selectedRoute?: Route
}

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
    if (!startQuery) return getAllRooms().slice(0, 5)
    return searchRooms(startQuery).slice(0, 8)
  }, [startQuery])

  const endResults = useMemo(() => {
    if (!endQuery) return getAllRooms().slice(0, 5)
    return searchRooms(endQuery).slice(0, 8)
  }, [endQuery])

  // Group results by category for display
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

  // Handle "washroom" broad category — find nearest of either gender
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

  return (
    <div className="w-full p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-100">Navigation</h2>
          <p className="text-xs text-slate-400">Find your way</p>
        </div>
      </div>

      {/* Start Location */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-slate-200 mb-2">From</label>
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
              className="w-full pl-10 pr-3 py-2.5 border border-slate-600 rounded-lg bg-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          {showStartDropdown && startResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-700 border border-slate-600 rounded-lg shadow-2xl z-20 max-h-60 overflow-y-auto">
              {startResults.map((room) => (
                <button
                  key={room.id}
                  onClick={() => handleStartSelect(room)}
                  className="w-full text-left px-4 py-3 hover:bg-slate-600 transition-colors border-b border-slate-600 last:border-b-0 hover:border-emerald-500"
                >
                  <div className="font-medium text-slate-100 text-sm">{room.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">Block {room.block} • Floor {room.floor}</div>
                </button>
              ))}
            </div>
          )}
        </div>
        {selectedStart && <div className="mt-2 text-xs text-emerald-400 font-medium">✓ {selectedStart.name}</div>}
      </div>

      {/* Quick Find Nearest — only when start is selected */}
      {selectedStart && (
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
            <Compass className="w-3 h-3 inline mr-1" />
            Find Nearest
          </label>
          <div className="grid grid-cols-3 gap-2">
            {QUICK_CATEGORIES.map((cat) => {
              const meta = CATEGORY_LABELS[cat]
              return (
                <button
                  key={cat}
                  onClick={() => handleFindNearest(cat)}
                  className="flex flex-col items-center gap-1 px-2 py-2.5 rounded-lg bg-slate-700/60 border border-slate-600 hover:bg-emerald-900/40 hover:border-emerald-500/50 transition-all text-center group"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">{meta?.icon}</span>
                  <span className="text-[10px] text-slate-300 font-medium leading-tight">{meta?.label}</span>
                </button>
              )
            })}
          </div>
          {nearestInfo && (
            <div className="mt-2 text-xs text-amber-300 font-medium bg-amber-900/20 border border-amber-700/30 rounded-lg px-3 py-2">
              {nearestInfo}
            </div>
          )}
        </div>
      )}

      {/* Swap Button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={handleSwap}
          disabled={!selectedStart || !selectedEnd}
          className="p-2 rounded-lg bg-slate-600 text-slate-300 hover:bg-emerald-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          title="Swap locations"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>
      </div>

      {/* End Location */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-200 mb-2">To</label>
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
                // Check if query matches a category for auto-nearest
                const cat = matchCategory(e.target.value)
                if (cat && selectedStart) {
                  handleFindNearest(cat)
                }
              }}
              onFocus={() => setShowEndDropdown(true)}
              className="w-full pl-10 pr-3 py-2.5 border border-slate-600 rounded-lg bg-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          {showEndDropdown && endResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-700 border border-slate-600 rounded-lg shadow-2xl z-20 max-h-60 overflow-y-auto">
              {Object.entries(groupedEndResults).map(([cat, rooms]) => {
                const meta = CATEGORY_LABELS[cat]
                return (
                  <div key={cat}>
                    {/* Category header */}
                    <div className="px-4 py-1.5 bg-slate-800/70 text-xs font-bold text-slate-400 uppercase tracking-wider sticky top-0">
                      {meta?.icon ?? "📌"} {meta?.label ?? cat}
                    </div>
                    {rooms.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => handleEndSelect(room)}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-600 transition-colors border-b border-slate-600/50 last:border-b-0"
                      >
                        <div className="font-medium text-slate-100 text-sm">{room.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Block {room.block} • Floor {room.floor}
                          {room.description && <span className="text-slate-500"> • {room.description}</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                )
              })}
            </div>
          )}
        </div>
        {selectedEnd && <div className="mt-2 text-xs text-emerald-400 font-medium">✓ {selectedEnd.name}</div>}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={handleFindRoute}
          disabled={!selectedStart || !selectedEnd}
          className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-md"
        >
          <Navigation className="w-4 h-4" />
          Find Route
        </button>
        <button
          onClick={handleClear}
          className="px-3 py-2.5 bg-slate-600 text-slate-200 rounded-lg hover:bg-slate-500 transition-colors"
          title="Clear selections"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Route Details */}
      {selectedRoute && (
        <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-lg p-4 border border-emerald-500/50">
          <h3 className="font-bold text-sm text-emerald-300 mb-3 flex items-center gap-2">
            <Navigation className="w-4 h-4" />
            Route Found
          </h3>

          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-emerald-400">Distance:</span>
              <span className="font-semibold text-emerald-300">{Math.round(selectedRoute.totalDistance)} units</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-emerald-400">Steps:</span>
              <span className="font-semibold text-emerald-300">{selectedRoute.steps.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-emerald-400">Floors:</span>
              <span className="font-semibold text-emerald-300">{selectedRoute.floorChanges}</span>
            </div>
          </div>

          {/* Directions */}
          <div className="bg-slate-700/50 rounded-lg p-3 max-h-48 overflow-y-auto border border-slate-600">
            <h4 className="text-xs font-bold text-slate-200 mb-2 uppercase">Directions</h4>
            <ol className="space-y-1.5 text-xs">
              {selectedRoute.steps.slice(0, 6).map((step, idx) => (
                <li key={idx} className="text-slate-300 flex gap-2">
                  <span className="font-bold text-emerald-400 flex-shrink-0">{idx + 1}.</span>
                  <span>
                    <span className="font-medium">{step.instruction}</span>
                    <span className="text-slate-500"> (F{step.floor})</span>
                  </span>
                </li>
              ))}
              {selectedRoute.steps.length > 6 && (
                <li className="text-emerald-400 font-medium">...and {selectedRoute.steps.length - 6} more steps</li>
              )}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
