// ============================================================
// PRP Building — Spatial Layout Layer
// C-block = 3 hexagons per side + center gem shape
// Hexagons ENLARGED to ensure all nodes fit inside
// ============================================================

export interface BlockDef {
  id: string; name: string; cx: number; cy: number
  polygon: string; labelX: number; labelY: number
  fill: string; stroke: string; rotation?: number
}
export interface SubShapeDef { id: string; polygon: string }
export interface ConnectorDef { id: string; polygon: string; fill: string }
export interface HexDef { cx: number; cy: number; r: number }

// ── MAIN BLOCKS ─────────────────────────────────────────────

export const BLOCKS: BlockDef[] = [
  {
    id: "E", name: "Block E", cx: 250, cy: 150,
    polygon: "250,55 320,95 320,210 250,250 180,210 180,95",
    labelX: 250, labelY: 150, fill: "#fee2e2", stroke: "#dc2626",
  },
  {
    id: "A", name: "Block A", cx: 750, cy: 150,
    polygon: "750,55 820,95 820,210 750,250 680,210 680,95",
    labelX: 750, labelY: 150, fill: "#dcfce7", stroke: "#16a34a",
  },
  {
    id: "D", name: "Block D", cx: 340, cy: 700,
    polygon: "295,655 385,655 385,745 295,745",
    labelX: 340, labelY: 700, fill: "#fef3c7", stroke: "#d97706", rotation: 45
  },
  {
    id: "B", name: "Block B", cx: 660, cy: 700,
    polygon: "615,655 705,655 705,745 615,745",
    labelX: 660, labelY: 700, fill: "#fef3c7", stroke: "#d97706", rotation: -45
  }
]

// ── C BLOCK SUB-SHAPES ──────────────────────────────────────
// L3/R3: directly attached to E/A blocks (connector hexes)
// L2/R2: rotated 45° inward per sketch
// L1/R1: standard pointy-top hexes
// GEM: pentagon center

export const C_SHAPES: SubShapeDef[] = [
  // L3 (directly attached to E, cx=300 cy=272 r=30)
  { id: "C_L3", polygon: "300,242 326,257 326,287 300,302 274,287 274,257" },
  // L2 (rotated -45° counter-clockwise, cx=360 cy=380 r=48)
  { id: "C_L2", polygon: "326,346 372,334 406,368 394,414 348,426 314,392" },
  // L1 (cx=420 cy=468 r=55): standard
  { id: "C_L1", polygon: "420,413 468,441 468,496 420,523 372,496 372,441" },

  // GEM center
  { id: "C_DI", polygon: "440,525 560,525 565,565 500,600 435,565" },

  // R1 (cx=580 cy=468 r=55): standard
  { id: "C_R1", polygon: "580,413 628,441 628,496 580,523 532,496 532,441" },
  // R2 (rotated 45° clockwise, cx=640 cy=380 r=48)
  { id: "C_R2", polygon: "674,346 686,392 652,426 606,414 594,368 628,334" },
  // R3 (directly attached to A, cx=700 cy=272 r=30)
  { id: "C_R3", polygon: "700,242 726,257 726,287 700,302 674,287 674,257" },

  // Corridor passages (wider ~24px trapezoids)
  { id: "C_cL3L2", polygon: "290,298 310,298 365,330 340,340" },
  { id: "C_cL2L1", polygon: "385,418 400,418 430,430 415,435" },
  { id: "C_cL1DI", polygon: "410,518 430,518 445,528 425,528" },
  { id: "C_cR3R2", polygon: "690,298 710,298 670,340 645,330" },
  { id: "C_cR2R1", polygon: "600,416 615,418 575,435 565,430" },
  { id: "C_cR1DI", polygon: "570,528 555,528 570,518 590,518" },
]

export const C_FILL = "#dbeafe"
export const C_STROKE = "#2563eb"

// ── CONNECTORS ──────────────────────────────────────────────

export const CONNECTORS: ConnectorDef[] = [
  // E bottom → L3 top (directly attached, seamless bridge)
  { id: "conn_E_C", polygon: "235,245 265,245 326,255 274,255", fill: "#d4dff7" },
  // A bottom → R3 top (directly attached, seamless bridge)
  { id: "conn_A_C", polygon: "735,245 765,245 726,255 674,255", fill: "#d4dff7" },
  // Gem lower-left → D
  { id: "conn_C_D", polygon: "438,562 448,572 375,660 360,645", fill: "#e8dfc7" },
  // Gem lower-right → B
  { id: "conn_C_B", polygon: "552,572 562,562 640,645 625,660", fill: "#e8dfc7" },
]

// ── DECORATIVE INNER HEXAGONS ───────────────────────────────

export const C_HEXAGONS: HexDef[] = [
  { cx: 305, cy: 290, r: 16 },
  { cx: 360, cy: 375, r: 22 },
  { cx: 420, cy: 468, r: 26 },
  { cx: 580, cy: 468, r: 26 },
  { cx: 640, cy: 375, r: 22 },
  { cx: 695, cy: 290, r: 16 },
]

export function hexPoints(cx: number, cy: number, r: number): string {
  return [0, 1, 2, 3, 4, 5]
    .map((i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 6
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
    })
    .join(" ")
}

export const NODE_COLORS: Record<string, string> = {
  room: "#3b82f6", corridor: "#94a3b8", intersection: "#8b5cf6",
  entrance: "#10b981", stairs: "#ef4444", elevator: "#f97316",
}
