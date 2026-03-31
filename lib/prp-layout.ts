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

// ── C BLOCK SUB-SHAPES (ENLARGED) ───────────────────────────
// L3: cx=305,cy=290,r=35
// L2: cx=360,cy=375,r=50
// L1: cx=420,cy=468,r=55
// GEM: pentagon from sketch — wide top, sides angle outward then in to bottom point
// R1: cx=580,cy=468,r=55
// R2: cx=640,cy=375,r=50
// R3: cx=695,cy=290,r=35

// Pointy-top hex vertices: top(cx,cy-r), UR(cx+r*.866,cy-r*.5),
// LR(cx+r*.866,cy+r*.5), bot(cx,cy+r), LL(cx-r*.866,cy+r*.5), UL(cx-r*.866,cy-r*.5)

export const C_SHAPES: SubShapeDef[] = [
  // L3 (cx=305 cy=290 r=35): 305,255 335,273 335,308 305,325 275,308 275,273
  { id: "C_L3", polygon: "305,255 335,273 335,308 305,325 275,308 275,273" },
  // L2 (cx=360 cy=375 r=50): 360,325 403,350 403,400 360,425 317,400 317,350
  { id: "C_L2", polygon: "360,325 403,350 403,400 360,425 317,400 317,350" },
  // L1 (cx=420 cy=468 r=55): 420,413 468,441 468,496 420,523 372,496 372,441
  { id: "C_L1", polygon: "420,413 468,441 468,496 420,523 372,496 372,441" },

  // GEM center — clean 5-point pentagon: flat top, pointed bottom (from sketch)
  { id: "C_DI", polygon: "440,525 560,525 565,565 500,600 435,565" },

  // R1 (cx=580 cy=468 r=55): 580,413 628,441 628,496 580,523 532,496 532,441
  { id: "C_R1", polygon: "580,413 628,441 628,496 580,523 532,496 532,441" },
  // R2 (cx=640 cy=375 r=50): 640,325 683,350 683,400 640,425 597,400 597,350
  { id: "C_R2", polygon: "640,325 683,350 683,400 640,425 597,400 597,350" },
  // R3 (cx=695 cy=290 r=35): 695,255 725,273 725,308 695,325 665,308 665,273
  { id: "C_R3", polygon: "695,255 725,273 725,308 695,325 665,308 665,273" },

  // Corridor passages (width ~18)
  { id: "C_cL3L2", polygon: "298,318 312,318 367,330 353,330" },
  { id: "C_cL2L1", polygon: "353,418 367,418 427,418 413,418" },
  { id: "C_cL1DI", polygon: "413,516 427,516 445,525 433,530" },
  { id: "C_cR3R2", polygon: "688,318 702,318 647,330 633,330" },
  { id: "C_cR2R1", polygon: "633,418 647,418 587,418 573,418" },
  { id: "C_cR1DI", polygon: "573,516 587,516 567,530 555,525" },
]

export const C_FILL = "#dbeafe"
export const C_STROKE = "#2563eb"

// ── CONNECTORS ──────────────────────────────────────────────

export const CONNECTORS: ConnectorDef[] = [
  // E bottom → L3 top
  { id: "conn_E_C", polygon: "275,273 305,255 335,273 315,218 250,250", fill: "#d4dff7" },
  // A bottom → R3 top
  { id: "conn_A_C", polygon: "665,273 695,255 725,273 685,218 750,250", fill: "#d4dff7" },
  // Gem lower-left → D (from left side of pentagon)
  { id: "conn_C_D", polygon: "438,562 448,572 375,660 360,645", fill: "#e8dfc7" },
  // Gem lower-right → B (from right side of pentagon)
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
