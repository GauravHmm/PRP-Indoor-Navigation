"use client"

import { BLOCKS, CONNECTORS, C_SHAPES, C_FILL, C_STROKE, C_HEXAGONS, hexPoints } from "@/lib/prp-layout"

interface MapLayersProps {
  onBlockClick: (cx: number, cy: number) => void
}

/** Static building geometry — blocks, connectors, hexagons, corridor spines */
export function MapLayers({ onBlockClick }: MapLayersProps) {
  return (
    <>
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
          onClick={() => onBlockClick(500, 380)}
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
            onClick={() => onBlockClick(b.cx, b.cy)}
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
    </>
  )
}
