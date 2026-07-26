"use client"

import type { PathStep } from "@/lib/pathfinding"
import { buildSvgPath } from "@/lib/path-utils"
import { FLOOR_LABELS } from "@/lib/prp-navigation-graph"

// ── SVG Route Path Overlay (inside the SVG) ──────

interface MapRoutePathProps {
  routePts: { x: number; y: number }[]
}

/** Renders the glowing route path inside the SVG */
export function MapRoutePath({ routePts }: MapRoutePathProps) {
  if (routePts.length <= 1) return null

  return (
    <>
      {/* Outer glow */}
      <path d={buildSvgPath(routePts)} fill="none" stroke="#22d3ee" strokeWidth="8"
        strokeLinecap="round" strokeLinejoin="round" opacity="0.12"
        filter="url(#pathGlow)" />
      {/* Main path */}
      <path d={buildSvgPath(routePts)} fill="none" stroke="#22d3ee" strokeWidth="3.5"
        strokeLinecap="round" strokeLinejoin="round" opacity="0.85"
        className="route-line" />
    </>
  )
}

// ── Route Info Panel (below the SVG) ─────────────

interface RouteInfoProps {
  highlightedPath: PathStep[]
  routeFloors: number[]
  currentFloor: number
  onFloorChange: (floor: number) => void
}

export function RouteInfo({ highlightedPath, routeFloors, currentFloor, onFloorChange }: RouteInfoProps) {
  const getFloorLabel = (f: number) => FLOOR_LABELS[f] || `Floor ${f}`

  return (
    <div className="bg-gradient-to-r from-cyan-900/20 to-emerald-900/20 border border-cyan-500/30 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="font-bold text-cyan-300 text-sm">Route Found</p>
        <div className="flex gap-3 text-xs text-slate-400">
          <span>{highlightedPath.length} steps</span>
          <span>·</span>
          <span>{highlightedPath.filter(s => s.type !== "corridor" && s.type !== "intersection").length} waypoints</span>
          {routeFloors.length > 1 && (
            <>
              <span>·</span>
              <span className="text-amber-400">{routeFloors.length} floors</span>
            </>
          )}
        </div>
      </div>
      {/* Floor segments indicator */}
      {routeFloors.length > 1 && (
        <div className="flex items-center gap-1 mt-2">
          {routeFloors.map((f, i) => (
            <div key={f} className="flex items-center gap-1">
              <button
                onClick={() => onFloorChange(f)}
                className={`px-2 py-0.5 text-xs rounded-md font-semibold transition-all duration-200 ${
                  currentFloor === f
                    ? "bg-cyan-500/30 text-cyan-300 border border-cyan-500/50"
                    : "bg-slate-700/50 text-slate-400 hover:text-cyan-300 border border-slate-600/50"
                }`}
              >
                {getFloorLabel(f)}
              </button>
              {i < routeFloors.length - 1 && (
                <span className="text-amber-400 text-xs font-bold">→</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
