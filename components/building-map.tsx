"use client"

import { useState, useRef, useCallback, useMemo } from "react"
import type { PathStep } from "@/lib/pathfinding"
import { navNodes } from "@/lib/prp-navigation-graph"
import { MapControls, TransitionBanner } from "@/components/map/map-controls"
import { MapLayers } from "@/components/map/map-layers"
import { MapNodes, MapTooltip } from "@/components/map/map-nodes"
import type { TooltipData } from "@/components/map/map-nodes"
import { MapRoutePath, RouteInfo } from "@/components/map/map-route"

interface BuildingMapProps {
  startFloor?: number
  highlightedPath?: PathStep[]
  selectedStart?: string
  selectedEnd?: string
}

interface Camera { x: number; y: number; zoom: number }

const W = 1000, H = 900, MIN_Z = 0.8, MAX_Z = 5

// ── Component ────────────────────────────────────

export function BuildingMap({ startFloor = 1, highlightedPath, selectedStart, selectedEnd }: BuildingMapProps) {
  const [cam, setCam] = useState<Camera>({ x: 0, y: 0, zoom: 1 })
  const [drag, setDrag] = useState(false)
  const [dStart, setDStart] = useState({ x: 0, y: 0 })
  const [floor, setFloor] = useState(startFloor)
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const [is3D, setIs3D] = useState(false)
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

  // ── Camera handlers ────────────────────────────
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

  // ── Derived data ───────────────────────────────
  const routePts = useMemo(() => {
    if (!highlightedPath) return []
    return highlightedPath.filter(s => s.floor === floor).map(s => ({ x: s.x, y: s.y }))
  }, [highlightedPath, floor])

  const transitionInfo = useMemo(() => {
    if (!highlightedPath || highlightedPath.length === 0) return null
    const floors = [...new Set(highlightedPath.map(s => s.floor))]
    if (floors.length <= 1) return null
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

  const routeFloors = useMemo(() => {
    if (!highlightedPath) return []
    return [...new Set(highlightedPath.map(s => s.floor))].sort()
  }, [highlightedPath])

  const nodes = useMemo(() => navNodes.filter(n => n.floor === floor), [floor])

  // ── Render ─────────────────────────────────────
  return (
    <div className="w-full space-y-4 p-3 sm:p-6 glass-panel">
      <MapControls
        zoom={cam.zoom}
        floor={floor}
        routeFloors={routeFloors}
        onReset={reset}
        onFloorChange={setFloor}
        onZoomTo={zoomTo}
        is3D={is3D}
        onToggle3D={() => setIs3D(!is3D)}
      />

      {transitionInfo && transitionInfo.length > 0 && (
        <TransitionBanner transitions={transitionInfo} onFloorChange={setFloor} />
      )}

      {/* ── SVG Map ────────────────────────────── */}
      <div 
        className="rounded-2xl border border-slate-700/50 bg-[#0a0f1e] overflow-hidden select-none shadow-xl transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] relative"
        style={{ perspective: "1500px" }}
      >
        <svg ref={svgRef} viewBox={vb}
          className={`w-full h-auto min-h-[400px] lg:min-h-[580px] origin-center transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${drag ? "cursor-grabbing" : "cursor-grab"}`}
          style={{ 
            transformStyle: "preserve-3d",
            transform: is3D ? "rotateX(55deg) rotateZ(-40deg) scale(1.4) translateY(-10%)" : "rotateX(0deg) rotateZ(0deg) scale(1) translateY(0%)" 
          }}
          onWheel={onWheel} onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}>

          {/* SVG Defs: glow filters */}
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

          {/* Static building geometry */}
          <MapLayers onBlockClick={zoomTo} />

          {/* Route path overlay */}
          <MapRoutePath routePts={routePts} />

          {/* Interactive nodes */}
          <MapNodes
            nodes={nodes}
            zoom={cam.zoom}
            selectedStart={selectedStart}
            selectedEnd={selectedEnd}
            highlightedPath={highlightedPath}
            transitionNodeIds={transitionNodeIds}
            onTooltipChange={setTooltip}
          />

          {/* Tooltip */}
          {tooltip && <MapTooltip tooltip={tooltip} />}
        </svg>
      </div>

      {/* Route summary panel */}
      {highlightedPath && highlightedPath.length > 0 && (
        <RouteInfo
          highlightedPath={highlightedPath}
          routeFloors={routeFloors}
          currentFloor={floor}
          onFloorChange={setFloor}
        />
      )}
    </div>
  )
}