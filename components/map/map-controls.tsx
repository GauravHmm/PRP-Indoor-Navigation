"use client"

import { FLOOR_LABELS } from "@/lib/prp-navigation-graph"
import { BLOCKS, C_FILL, C_STROKE } from "@/lib/prp-layout"

interface MapControlsProps {
  zoom: number
  floor: number
  routeFloors: number[]
  onReset: () => void
  onFloorChange: (floor: number) => void
  onZoomTo: (cx: number, cy: number) => void
  is3D?: boolean
  onToggle3D?: () => void
}

const ZOOM_TARGETS = [
  ...BLOCKS.map(b => ({ id: b.id, cx: b.cx, cy: b.cy, fill: b.fill, stroke: b.stroke })),
  { id: "C", cx: 500, cy: 380, fill: C_FILL, stroke: C_STROKE },
]

export function MapControls({ zoom, floor, routeFloors, onReset, onFloorChange, onZoomTo, is3D, onToggle3D }: MapControlsProps) {
  return (
    <div className="flex gap-2 justify-between items-center flex-wrap">
      <div className="flex gap-2 items-center">
        <button onClick={onReset} aria-label="Reset map view" className="px-4 py-2 bg-slate-700/80 text-slate-200 hover:bg-slate-600 rounded-xl text-sm font-medium transition-all duration-200 border border-slate-600/50 shadow-sm">
          Reset View
        </button>
        {onToggle3D && (
          <button 
            onClick={onToggle3D} 
            aria-label={is3D ? "Switch to 2D view" : "Switch to 3D view"}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 border shadow-sm ${
              is3D 
                ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-900 border-transparent shadow-cyan-500/30" 
                : "bg-[#0f172a] text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30 border-cyan-500/30"
            }`}
          >
            {is3D ? "3D Mode" : "2D Mode"}
          </button>
        )}
        <span className="text-slate-500 text-sm font-mono ml-1">{Math.round(zoom * 100)}%</span>
      </div>

      {/* Floor selector */}
      <div className="flex gap-1 items-center bg-[#0f172a] rounded-xl p-1 border border-slate-700/50">
        {Object.entries(FLOOR_LABELS).map(([f, label]) => {
          const fNum = Number(f)
          const isActive = floor === fNum
          const isOnRoute = routeFloors.includes(fNum)
          return (
            <button key={f} onClick={() => onFloorChange(fNum)}
              aria-label={`Switch to ${label}`}
              className={`px-3.5 py-1.5 text-xs rounded-lg font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-900 shadow-lg shadow-cyan-500/20"
                  : isOnRoute
                    ? "text-cyan-400 hover:text-white hover:bg-slate-700/80 border border-cyan-500/30"
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
              }`}>
              {label}
              {isOnRoute && !isActive && <span className="ml-1 inline-block w-1.5 h-1.5 bg-cyan-400 rounded-full" />}
            </button>
          )
        })}
      </div>

      {/* Block zoom buttons */}
      <div className="flex gap-1 flex-wrap">
        {ZOOM_TARGETS.map(b => (
          <button key={b.id} onClick={() => onZoomTo(b.cx, b.cy)}
            aria-label={`Zoom to Block ${b.id}`}
            className="px-3 py-1.5 text-xs rounded-lg font-semibold transition-all duration-200 hover:scale-105 border"
            style={{ backgroundColor: b.fill + "20", color: b.stroke, borderColor: b.stroke + "40" }}>
            {b.id}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Transition Banner ────────────────────────────

interface TransitionBannerProps {
  transitions: { fromFloor: number; toFloor: number; nodeType: string; nodeName: string }[]
  onFloorChange: (floor: number) => void
}

export function TransitionBanner({ transitions, onFloorChange }: TransitionBannerProps) {
  const getFloorLabel = (f: number) => FLOOR_LABELS[f] || `Floor ${f}`

  return (
    <div className="flex flex-wrap gap-2">
      {transitions.map((t, i) => (
        <div key={i} className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-sm">
          <span className="text-amber-400 font-bold text-xs">⬆</span>
          <span className="text-amber-200 font-medium">
            Move to {getFloorLabel(t.toFloor)} via {t.nodeType === "stairs" ? "Stairs" : "Lift"}
          </span>
          <button
            onClick={() => onFloorChange(t.toFloor)}
            className="ml-2 px-2 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-300 rounded-md hover:bg-amber-500/40 transition-colors duration-200 border border-amber-500/30"
          >
            Switch
          </button>
        </div>
      ))}
    </div>
  )
}
