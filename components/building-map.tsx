"use client"

import { useState, useRef, useCallback, useMemo } from "react"
import type { PathStep } from "@/lib/pathfinding"
import { navNodes } from "@/lib/prp-navigation-graph"
import { FLOOR_LABELS } from "@/lib/prp-navigation-graph"
import { BLOCKS, CONNECTORS, C_SHAPES, C_FILL, C_STROKE, C_HEXAGONS, hexPoints, NODE_COLORS } from "@/lib/prp-layout"
import { buildSvgPath } from "@/lib/path-utils"

interface BuildingMapProps {
  startFloor?: number
  highlightedPath?: PathStep[]
  selectedStart?: string
  selectedEnd?: string
}

interface Camera { x: number; y: number; zoom: number }

const W = 1000, H = 900, MIN_Z = 0.8, MAX_Z = 5

export function BuildingMap({ startFloor = 1, highlightedPath, selectedStart, selectedEnd }: BuildingMapProps) {
  const [cam, setCam] = useState<Camera>({ x: 0, y: 0, zoom: 1 })
  const [drag, setDrag] = useState(false)
  const [dStart, setDStart] = useState({ x: 0, y: 0 })
  const [floor, setFloor] = useState(startFloor)
  const svgRef = useRef<SVGSVGElement>(null)

  // Content bounds (where the building shapes live)
  const CX_MIN = 100, CX_MAX = 900, CY_MIN = 0, CY_MAX = 860

  // Clamp camera so content stays visible
  const clampCam = useCallback((c: Camera): Camera => {
    const vw = W / c.zoom, vh = H / c.zoom
    const xMin = CX_MIN - vw * 0.3, xMax = CX_MAX - vw * 0.7
    const yMin = CY_MIN - vh * 0.15, yMax = CY_MAX - vh * 0.7
    return { x: Math.max(xMin, Math.min(xMax, c.x)), y: Math.max(yMin, Math.min(yMax, c.y)), zoom: c.zoom }
  }, [])

  const vw = W / cam.zoom, vh = H / cam.zoom
  const vb = `${cam.x} ${cam.y} ${vw} ${vh}`

  const onWheel = useCallback((e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault()
    const svg = svgRef.current
    if (!svg) return
    const r = svg.getBoundingClientRect()
    const mx = e.clientX - r.left, my = e.clientY - r.top
    const sx = cam.x + (mx / r.width) * vw
    const sy = cam.y + (my / r.height) * vh
    const nz = Math.max(MIN_Z, Math.min(MAX_Z, cam.zoom * (e.deltaY > 0 ? 0.9 : 1.1)))
    const nw = W / nz, nh = H / nz
    setCam(clampCam({ x: sx - (mx / r.width) * nw, y: sy - (my / r.height) * nh, zoom: nz }))
  }, [cam, vw, vh, clampCam])

  const onDown = useCallback((e: React.MouseEvent) => { setDrag(true); setDStart({ x: e.clientX, y: e.clientY }) }, [])
  const onMove = useCallback((e: React.MouseEvent) => {
    if (!drag || !svgRef.current) return
    const r = svgRef.current.getBoundingClientRect()
    setCam(c => clampCam({ ...c, x: c.x - ((e.clientX - dStart.x) / r.width) * (W / c.zoom), y: c.y - ((e.clientY - dStart.y) / r.height) * (H / c.zoom) }))
    setDStart({ x: e.clientX, y: e.clientY })
  }, [drag, dStart, clampCam])
  const onUp = useCallback(() => setDrag(false), [])
  const reset = useCallback(() => setCam({ x: 0, y: 0, zoom: 1 }), [])
  const zoomTo = useCallback((cx: number, cy: number) => {
    const z = 2.5; setCam(clampCam({ x: cx - W / z / 2, y: cy - H / z / 2, zoom: z }))
  }, [clampCam])

  const routePts = useMemo(() => highlightedPath?.map(s => ({ x: s.x, y: s.y })) ?? [], [highlightedPath])
  const nodes = useMemo(() => navNodes.filter(n => n.floor === floor), [floor])

  // Zoom targets: include C block center
  const allZoomTargets = [
    ...BLOCKS.map(b => ({ id: b.id, cx: b.cx, cy: b.cy, fill: b.fill, stroke: b.stroke })),
    { id: "C", cx: 500, cy: 380, fill: C_FILL, stroke: C_STROKE },
  ]

  return (
    <div className="w-full space-y-4 bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl">
      {/* Controls */}
      <div className="flex gap-2 justify-between items-center flex-wrap">
        <div className="flex gap-2 items-center">
          <button onClick={reset} className="px-4 py-2 bg-slate-700 text-slate-200 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors">Reset View</button>
          <span className="text-slate-400 text-sm">{Math.round(cam.zoom * 100)}%</span>
        </div>
        {/* Floor selector */}
        <div className="flex gap-1 items-center bg-slate-800 rounded-lg p-1">
          {Object.entries(FLOOR_LABELS).map(([f, label]) => (
            <button key={f} onClick={() => setFloor(Number(f))}
              className={`px-3 py-1.5 text-xs rounded-md font-semibold transition-all ${
                floor === Number(f)
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700"
              }`}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 flex-wrap">
          {allZoomTargets.map(b => (
            <button key={b.id} onClick={() => zoomTo(b.cx, b.cy)}
              className="px-3 py-1.5 text-xs rounded-md font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: b.fill, color: b.stroke, border: `1.5px solid ${b.stroke}` }}>
              {b.id}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Map */}
      <div className="rounded-xl border-2 border-slate-700 bg-slate-950 overflow-hidden select-none">
        <svg ref={svgRef} viewBox={vb}
          className={`w-full h-auto ${drag ? "cursor-grabbing" : "cursor-grab"}`}
          style={{ minHeight: "580px" }}
          onWheel={onWheel} onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}>

          {/* Background */}
          <rect x="-300" y="-300" width="1600" height="1600" fill="#0f172a" />

          {/* Layer 1: Connector shapes */}
          {CONNECTORS.map(c => (
            <polygon key={c.id} points={c.polygon} fill={c.fill} stroke="none" opacity="0.6" />
          ))}

          {/* Layer 2a: Corridor shapes (BEHIND hexagons — overlap hidden by hex on top) */}
          {C_SHAPES.filter(s => s.id.startsWith("C_c")).map(s => (
            <polygon key={s.id} points={s.polygon} fill={C_FILL} stroke={C_STROKE}
              strokeWidth="1.5" opacity="0.85" />
          ))}

          {/* Layer 2b: Hex shapes (ON TOP — hides corridor overlap for clean joins) */}
          {C_SHAPES.filter(s => !s.id.startsWith("C_c")).map(s => (
            <polygon key={s.id} points={s.polygon} fill={C_FILL} stroke={C_STROKE}
              strokeWidth="2" opacity="0.9"
              onClick={() => zoomTo(500, 380)}
              className="cursor-pointer hover:opacity-100 transition-opacity" />
          ))}

          {/* C Block label */}
          <text x="500" y="610" textAnchor="middle" dominantBaseline="middle"
            fill={C_STROKE} fontSize="12" fontWeight="700" className="pointer-events-none">
            Block C
          </text>

          {/* Layer 2b: Other block polygons (E, A, D, B) */}
          {BLOCKS.map(b => (
            <g key={b.id} transform={b.rotation ? `rotate(${b.rotation}, ${b.cx}, ${b.cy})` : undefined}>
              <polygon points={b.polygon} fill={b.fill} stroke={b.stroke} strokeWidth="2.5" opacity="0.9"
                onClick={() => zoomTo(b.cx, b.cy)}
                className="cursor-pointer hover:opacity-100 transition-opacity" />
              <text x={b.labelX} y={b.labelY} textAnchor="middle" dominantBaseline="middle"
                fill={b.stroke} fontSize="12" fontWeight="700" className="pointer-events-none">
                {b.name}
              </text>
            </g>
          ))}

          {/* Layer 3: Decorative inner hexagons */}
          {C_HEXAGONS.map((h, i) => (
            <polygon key={`hex-${i}`} points={hexPoints(h.cx, h.cy, h.r)}
              fill="none" stroke="#93c5fd" strokeWidth="1" opacity="0.4" />
          ))}

          {/* Layer 4: Corridor spine lines */}
          <g stroke="#94a3b8" strokeWidth="1" opacity="0.25" strokeDasharray="4 3">
            {/* E/A block vertical spines */}
            <line x1="250" y1="70" x2="250" y2="235" />
            <line x1="750" y1="70" x2="750" y2="235" />
            {/* Courtyard vertical */}
            <line x1="500" y1="80" x2="500" y2="608" />
            {/* E1 → A1 horizontal */}
            <line x1="315" y1="152" x2="685" y2="152" />
            {/* E→C connector */}
            <polyline points="250,235 260,243 278,248 300,252" fill="none" />
            {/* Left arm: L3→L2→L1→Gem (shifted) */}
            <polyline points="300,252 300,298 326,318 360,340 360,426 420,453 420,563 445,605 500,610" fill="none" />
            {/* A→C connector */}
            <polyline points="750,235 740,243 722,248 700,252" fill="none" />
            {/* Right arm: R3→R2→R1→Gem (shifted) */}
            <polyline points="700,252 700,298 674,318 640,340 640,426 580,453 580,563 555,605 500,610" fill="none" />
            {/* Gem vertical spine */}
            <line x1="500" y1="610" x2="500" y2="675" />
            {/* C→D connector (shifted +80) */}
            <polyline points="445,625 442,652 425,680 408,705 390,730 375,740" fill="none" />
            {/* C→B connector (shifted +80) */}
            <polyline points="555,625 558,652 578,680 598,705 615,730 640,740" fill="none" />
          </g>

          {/* Layer 5: Route path */}
          {routePts.length > 1 && (
            <>
              <path d={buildSvgPath(routePts)} fill="none" stroke="#3b82f6" strokeWidth="7"
                strokeLinecap="round" strokeLinejoin="round" opacity="0.25" />
              <path d={buildSvgPath(routePts)} fill="none" stroke="#60a5fa" strokeWidth="3.5"
                strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
            </>
          )}

          {/* Layer 6: Nodes */}
          {nodes.map(n => {
            const isSt = selectedStart === n.id
            const isEn = selectedEnd === n.id
            const onPath = highlightedPath?.some(s => s.nodeId === n.id)
            const isRoom = n.type === "room"
            const isInfra = n.type === "stairs" || n.type === "elevator" || n.type === "entrance"
            if (!isRoom && !isInfra && !onPath && !isSt && !isEn && cam.zoom < 1.8) return null
            const r = isSt || isEn ? 6 : isRoom || isInfra ? 4 : 2.5
            const col = NODE_COLORS[n.type] || "#94a3b8"
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={r} fill={col}
                  stroke={isSt || isEn ? "#fbbf24" : onPath ? "#34d399" : "rgba(255,255,255,0.25)"}
                  strokeWidth={isSt || isEn ? 2.5 : 0.8}
                  opacity={onPath || isSt || isEn || !highlightedPath ? 1 : 0.3}
                  className="transition-all duration-200" />
                {cam.zoom >= 2 && (isRoom || isInfra) && (
                  <text x={n.x} y={n.y - r - 2} textAnchor="middle" fill="#e2e8f0"
                    fontSize="6" fontWeight="500" className="pointer-events-none">{n.name}</text>
                )}
                <title>{`${n.name} (${n.type}) — Block ${n.block}${n.description ? ` — ${n.description}` : ''}`}</title>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Route info */}
      {highlightedPath && highlightedPath.length > 0 && (
        <div className="bg-gradient-to-r from-blue-900/40 to-teal-900/40 border border-blue-500/40 rounded-lg p-4">
          <p className="font-bold text-blue-100 text-sm mb-1">Route Found</p>
          <p className="text-blue-300 text-xs">
            {highlightedPath.length} steps • {highlightedPath.filter(s => s.type !== "corridor" && s.type !== "intersection").length} waypoints
          </p>
        </div>
      )}
    </div>
  )
}