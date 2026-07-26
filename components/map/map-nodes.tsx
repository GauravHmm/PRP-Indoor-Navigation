"use client"

import type { PathStep } from "@/lib/pathfinding"
import type { NavNode } from "@/lib/prp-navigation-graph"
import { NODE_COLORS, CATEGORY_COLORS } from "@/lib/prp-layout"

interface TooltipData {
  x: number; y: number; name: string; category: string; block: string
}

interface MapNodesProps {
  nodes: NavNode[]
  zoom: number
  selectedStart?: string
  selectedEnd?: string
  highlightedPath?: PathStep[]
  transitionNodeIds: Set<string>
  onTooltipChange: (tooltip: TooltipData | null) => void
}

/** Get node category color, falling back to type color */
function getNodeColor(node: { type: string; category?: string }): string {
  if (node.category && CATEGORY_COLORS[node.category]) return CATEGORY_COLORS[node.category]
  return NODE_COLORS[node.type] || "#64748b"
}

export function MapNodes({
  nodes, zoom, selectedStart, selectedEnd,
  highlightedPath, transitionNodeIds, onTooltipChange,
}: MapNodesProps) {
  return (
    <>
      {nodes.map(n => {
        const isSt = selectedStart === n.id
        const isEn = selectedEnd === n.id
        const onPath = highlightedPath?.some(s => s.nodeId === n.id)
        const isRoom = n.type === "room"
        const isInfra = n.type === "stairs" || n.type === "elevator" || n.type === "entrance"
        const isCorridor = n.type === "corridor" || n.type === "intersection"
        const isTransition = transitionNodeIds.has(n.id)

        // Visibility: corridors hidden at low zoom unless on path
        if (isCorridor && !isSt && !isEn && !onPath && zoom < 1.8) return null

        // Node sizing
        let r = 2
        if (isSt) r = 7
        else if (isEn) r = 6
        else if (onPath && isCorridor) r = 1.5
        else if (isInfra) r = 3.5
        else if (isRoom) r = 3

        // ── Node coloring ──
        let col = getNodeColor(n)
        if (isSt) col = "#10b981"
        if (isEn) col = "#ef4444"
        if (onPath && isCorridor) col = "#22d3ee"

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
                onTooltipChange({
                  x: n.x, y: n.y,
                  name: n.name,
                  category: n.category || n.type,
                  block: n.block,
                })
              }
            }}
            onMouseLeave={() => onTooltipChange(null)}
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

            {/* Node label */}
            {zoom >= 1.8 && (isRoom || isInfra) && (
              <text x={n.x} y={n.y - r - 3} textAnchor="middle" fill="#e2e8f0"
                fontSize="5" fontWeight="600" className="pointer-events-none" opacity="0.8">{n.name}</text>
            )}
          </g>
        )
      })}
    </>
  )
}

// ── Tooltip Overlay ──────────────────────────────

export function MapTooltip({ tooltip }: { tooltip: TooltipData }) {
  return (
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
  )
}

export type { TooltipData }
