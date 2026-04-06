"use client"

import { useState, useRef, useCallback, useMemo } from "react"
import type { PathStep } from "@/lib/pathfinding"
import { navNodes } from "@/lib/prp-navigation-graph"
import { FLOOR_LABELS } from "@/lib/prp-navigation-graph"
import { BLOCKS, CONNECTORS, C_SHAPES, C_FILL, C_STROKE, C_HEXAGONS, hexPoints, NODE_COLORS, CATEGORY_COLORS } from "@/lib/prp-layout"
import { buildSvgPath } from "@/lib/path-utils"

interface BuildingMapProps {
  startFloor?: number
  highlightedPath?: PathStep[]
  selectedStart?: string
  selectedEnd?: string
}

interface Camera { x: number; y: number; zoom: number }

const W = 1000, H = 900, MIN_Z = 0.8, MAX_Z = 5

// ── Helpers ──────────────────────────────────────

/** Get node category color, falling back to type color */
function getNodeColor(node: { type: string; category?: string }): string {
  if (node.category && CATEGORY_COLORS[node.category]) return CATEGORY_COLORS[node.category]
  return NODE_COLORS[node.type] || "#64748b"
}

/** Check if a node is a transition node (stairs/elevator) */
function isTransitionNode(type: string): boolean {
  return type === "stairs" || type === "elevator"
}

// ── Component ────────────────────────────────────

export function BuildingMap({ startFloor = 1, highlightedPath, selectedStart, selectedEnd }: BuildingMapProps) {
  const [cam, setCam] = useState<Camera>({ x: 0, y: 0, zoom: 1 })
  const [drag, setDrag] = useState(false)
  const [dStart, setDStart] = useState({ x: 0, y: 0 })
  const [floor, setFloor] = useState(startFloor)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; category: string; block: string } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  // Content bounds
  const CX_MIN = 100, CX_MAX = 900, CY_MIN = 0, CY_MAX = 860

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

  // ── Path segmentation by floor ────────────────
  const floorPath = useMemo(() => {
    if (!highlightedPath) return []
    return highlightedPath.filter(s => s.floor === floor)
  }, [highlightedPath, floor])

  const routePts = useMemo(() => floorPath.map(s => ({ x: s.x, y: s.y })), [floorPath])

  // ── Transition info ───────────────────────────
  const transitionInfo = useMemo(() => {
    if (!highlightedPath || highlightedPath.length === 0) return null
    const floors = [...new Set(highlightedPath.map(s => s.floor))]
    if (floors.length <= 1) return null
    // Find transition points (where floor changes)
    const transitions: { fromFloor: number; toFloor: number; nodeType: string; nodeName: string }[] = []
    for (let i = 1; i < highlightedPath.length; i++) {
      if (highlightedPath[i].floor !== highlightedPath[i - 1].floor) {
        transitions.push({
          fromFloor: highlightedPath[i - 1].floor,
          toFloor: highlightedPath[i].floor,
          nodeType: highlightedPath[i - 1].type,
          nodeName: highlightedPath[i - 1].nodeName,
        })
      }
    }
    return transitions
  }, [highlightedPath])

  // Transition nodes on current floor (for yellow pulsing)
  const transitionNodeIds = useMemo(() => {
    if (!highlightedPath || !transitionInfo) return new Set<string>()
    const ids = new Set<string>()
    for (let i = 1; i < highlightedPath.length; i++) {
      if (highlightedPath[i].floor !== highlightedPath[i - 1].floor) {
        ids.add(highlightedPath[i - 1].nodeId)
        ids.add(highlightedPath[i].nodeId)
      }
    }
    return ids
  }, [highlightedPath, transitionInfo])

  // All floors in the route
  const routeFloors = useMemo(() => {
    if (!highlightedPath) return []
    return [...new Set(highlightedPath.map(s => s.floor))].sort()
  }, [highlightedPath])

  const nodes = useMemo(() => navNodes.filter(n => n.floor === floor), [floor])

  // Zoom targets
  const allZoomTargets = [
    ...BLOCKS.map(b => ({ id: b.id, cx: b.cx, cy: b.cy, fill: b.fill, stroke: b.stroke })),
    { id: "C", cx: 500, cy: 380, fill: C_FILL, stroke: C_STROKE },
  ]

  // Floor label helper
  const getFloorLabel = (f: number) => FLOOR_LABELS[f] || `Floor ${f}`

  return (
    <div className="w-full space-y-4 p-6 glass-panel">
      {/* ── Controls ────────────────────────────── */}
      <div className="flex gap-2 justify-between items-center flex-wrap">
        <div className="flex gap-2 items-center">
          <button onClick={reset} className="px-4 py-2 bg-slate-700/80 text-slate-200 hover:bg-slate-600 rounded-xl text-sm font-medium transition-all duration-200 border border-slate-600/50">
            Reset View
          </button>
          <span className="text-slate-500 text-sm font-mono">{Math.round(cam.zoom * 100)}%</span>
        </div>

        {/* Floor selector */}
        <div className="flex gap-1 items-center bg-[#0f172a] rounded-xl p-1 border border-slate-700/50">
          {Object.entries(FLOOR_LABELS).map(([f, label]) => {
            const fNum = Number(f)
            const isActive = floor === fNum
            const isOnRoute = routeFloors.includes(fNum)
            return (
              <button key={f} onClick={() => setFloor(fNum)}
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
          {allZoomTargets.map(b => (
            <button key={b.id} onClick={() => zoomTo(b.cx, b.cy)}
              className="px-3 py-1.5 text-xs rounded-lg font-semibold transition-all duration-200 hover:scale-105 border"
              style={{ backgroundColor: b.fill + "20", color: b.stroke, borderColor: b.stroke + "40" }}>
              {b.id}
            </button>
          ))}
        </div>
      </div>

      {/* ── Transition Banner ──────────────────── */}
      {transitionInfo && transitionInfo.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {transitionInfo.map((t, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-sm">
              <span className="text-amber-400 font-bold text-xs">⬆</span>
              <span className="text-amber-200 font-medium">
                Move to {getFloorLabel(t.toFloor)} via {t.nodeType === "stairs" ? "Stairs" : "Lift"}
              </span>
              <button
                onClick={() => setFloor(t.toFloor)}
                className="ml-2 px-2 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-300 rounded-md hover:bg-amber-500/40 transition-colors duration-200 border border-amber-500/30"
              >
                Switch
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── SVG Map ────────────────────────────── */}
      <div className="rounded-2xl border border-slate-700/50 bg-[#0a0f1e] overflow-hidden select-none shadow-xl">
        <svg ref={svgRef} viewBox={vb}
          className={`w-full h-auto ${drag ? "cursor-grabbing" : "cursor-grab"}`}
          style={{ minHeight: "580px" }}
          onWheel={onWheel} onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}>

          {/* SVG Defs: glow filter */}
          <defs>
            <filter id="pathGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background */}
          <rect x="-300" y="-300" width="1600" height="1600" fill="#0a0f1e" />

          {/* Layer 1: Connector shapes */}
          {CONNECTORS.map(c => (
            <polygon key={c.id} points={c.polygon} fill={c.fill} stroke="none" opacity="0.5" />
          ))}

          {/* Layer 2a: Corridor shapes */}
          {C_SHAPES.filter(s => s.id.startsWith("C_c")).map(s => (
            <polygon key={s.id} points={s.polygon} fill={C_FILL} stroke={C_STROKE}
              strokeWidth="1.5" opacity="0.7" />
          ))}

          {/* Layer 2b: Hex shapes */}
          {C_SHAPES.filter(s => !s.id.startsWith("C_c")).map(s => (
            <polygon key={s.id} points={s.polygon} fill={C_FILL} stroke={C_STROKE}
              strokeWidth="2" opacity="0.8"
              onClick={() => zoomTo(500, 380)}
              className="cursor-pointer hover:opacity-100 transition-opacity" />
          ))}

          {/* C Block label */}
          <text x="500" y="610" textAnchor="middle" dominantBaseline="middle"
            fill={C_STROKE} fontSize="12" fontWeight="700" className="pointer-events-none">
            Block C
          </text>

          {/* Layer 2c: Other block polygons */}
          {BLOCKS.map(b => (
            <g key={b.id} transform={b.rotation ? `rotate(${b.rotation}, ${b.cx}, ${b.cy})` : undefined}>
              <polygon points={b.polygon} fill={b.fill} stroke={b.stroke} strokeWidth="2.5" opacity="0.8"
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
              fill="none" stroke="#93c5fd" strokeWidth="1" opacity="0.3" />
          ))}

          {/* Layer 4: Corridor spine lines */}
          <g stroke="#94a3b8" strokeWidth="1" opacity="0.15" strokeDasharray="4 3">
            <line x1="250" y1="70" x2="250" y2="235" />
            <line x1="750" y1="70" x2="750" y2="235" />
            <line x1="500" y1="80" x2="500" y2="608" />
            <line x1="315" y1="152" x2="685" y2="152" />
            <polyline points="250,235 260,243 278,248 300,252" fill="none" />
            <polyline points="300,252 300,298 326,318 360,340 360,426 420,453 420,563 445,605 500,610" fill="none" />
            <polyline points="750,235 740,243 722,248 700,252" fill="none" />
            <polyline points="700,252 700,298 674,318 640,340 640,426 580,453 580,563 555,605 500,610" fill="none" />
            <line x1="500" y1="610" x2="500" y2="675" />
            <polyline points="445,625 442,652 425,680 408,705 390,730 375,740" fill="none" />
            <polyline points="555,625 558,652 578,680 598,705 615,730 640,740" fill="none" />
          </g>

          {/* Layer 5: Route path — glow layer + main line */}
          {routePts.length > 1 && (
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
          )}

          {/* Layer 6: Nodes */}
          {nodes.map(n => {
            const isSt = selectedStart === n.id
            const isEn = selectedEnd === n.id
            const onPath = highlightedPath?.some(s => s.nodeId === n.id)
            const isRoom = n.type === "room"
            const isInfra = n.type === "stairs" || n.type === "elevator" || n.type === "entrance"
            const isCorridor = n.type === "corridor" || n.type === "intersection"
            const isTransition = transitionNodeIds.has(n.id)

            // ── Progressive zoom-based visibility ──
            // Always show: start, end, path nodes
            // Zoom < 1.5: hide everything else (clean overview)
            // Zoom 1.5-2.2: show rooms and infrastructure
            // Zoom > 2.2: show corridors and intersections too
            if (!isSt && !isEn && !onPath) {
              if (cam.zoom < 1.5) return null
              if (isCorridor && cam.zoom < 2.2) return null
            }

            // ── Node sizing ──
            // Start/end: large; rooms/infra: medium; on-path corridor: tiny; others: small
            let r = 2.5
            if (isSt) r = 7
            else if (isEn) r = 6
            else if (onPath && isCorridor) r = 1.5 // tiny dots on path for corridors
            else if (isInfra) r = 3.5
            else if (isRoom) r = 3

            // ── Node coloring ──
            let col = getNodeColor(n)
            if (isSt) col = "#10b981"
            if (isEn) col = "#ef4444"
            if (onPath && isCorridor) col = "#22d3ee" // blend with path

            // ── Stroke ──
            let strokeCol = "rgba(255,255,255,0.1)"
            let strokeW = 0.6
            if (isSt) { strokeCol = "#10b981"; strokeW = 2.5 }
            else if (isEn) { strokeCol = "#ef4444"; strokeW = 2.5 }
            else if (isTransition && onPath) { strokeCol = "#facc15"; strokeW = 2 }
            else if (onPath && !isCorridor) { strokeCol = "#22d3ee"; strokeW = 1.2 }
            else if (onPath && isCorridor) { strokeCol = "none"; strokeW = 0 }

            const opacity = isSt || isEn ? 1 :
              onPath ? (isCorridor ? 0.4 : 0.95) :
              !highlightedPath ? 0.85 : 0.15

            return (
              <g key={n.id}
                onMouseEnter={() => {
                  if (isRoom || isInfra) {
                    setTooltip({
                      x: n.x, y: n.y,
                      name: n.name,
                      category: n.category || n.type,
                      block: n.block,
                    })
                  }
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                {/* Transition node: yellow pulse ring */}
                {isTransition && onPath && (
                  <circle cx={n.x} cy={n.y} r={r + 5} fill="none" stroke="#facc15" strokeWidth="1.5"
                    opacity="0.5">
                    <animate attributeName="r" values={`${r + 3};${r + 9};${r + 3}`} dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Start/End: pulse ring */}
                {(isSt || isEn) && (
                  <circle cx={n.x} cy={n.y} r={r + 3} fill="none" stroke={isSt ? "#10b981" : "#ef4444"} strokeWidth="1.5"
                    opacity="0.35">
                    <animate attributeName="r" values={`${r + 2};${r + 7};${r + 2}`} dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0.08;0.4" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Main node circle */}
                <circle cx={n.x} cy={n.y} r={r}
                  fill={isTransition && onPath ? "#facc15" : col}
                  stroke={strokeCol}
                  strokeWidth={strokeW}
                  opacity={opacity}
                  className="transition-all duration-200" />

                {/* Node label (zoomed in, rooms/infra only) */}
                {cam.zoom >= 2.2 && (isRoom || isInfra) && (
                  <text x={n.x} y={n.y - r - 3} textAnchor="middle" fill="#e2e8f0"
                    fontSize="5" fontWeight="600" className="pointer-events-none" opacity="0.8">{n.name}</text>
                )}
              </g>
            )
          })}

          {/* Layer 7: Tooltip overlay */}
          {tooltip && (
            <g className="pointer-events-none">
              <rect
                x={tooltip.x - 50}
                y={tooltip.y - 38}
                width="100"
                height="26"
                rx="6"
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="1"
                opacity="0.95"
              />
              <text x={tooltip.x} y={tooltip.y - 27} textAnchor="middle" fill="#f1f5f9"
                fontSize="6" fontWeight="700">{tooltip.name}</text>
              <text x={tooltip.x} y={tooltip.y - 19} textAnchor="middle" fill="#94a3b8"
                fontSize="4.5" fontWeight="500">
                {tooltip.category} · Block {tooltip.block}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* ── Route Info ────────────────────────── */}
      {highlightedPath && highlightedPath.length > 0 && (
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
                    onClick={() => setFloor(f)}
                    className={`px-2 py-0.5 text-xs rounded-md font-semibold transition-all duration-200 ${
                      floor === f
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
      )}
    </div>
  )
}