// ============================================================
// PRP Building — Spatial Layout Layer
// Hexagons SPACED OUT with clear corridor gaps between them
// L1/R1: +40px, Gem/D/B: +80px vertical shift
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
    id: "D", name: "Block D", cx: 340, cy: 780,
    polygon: "295,735 385,735 385,825 295,825",
    labelX: 340, labelY: 780, fill: "#fef3c7", stroke: "#d97706", rotation: 45
  },
  {
    id: "B", name: "Block B", cx: 660, cy: 780,
    polygon: "615,735 705,735 705,825 615,825",
    labelX: 660, labelY: 780, fill: "#fef3c7", stroke: "#d97706", rotation: -45
  }
]

// ── C BLOCK SUB-SHAPES ──────────────────────────────────────
// L3/R3: no shift (attached to E/A)
// L2/R2: no shift
// L1/R1: +40px vertical
// GEM: +80px vertical

export const C_SHAPES: SubShapeDef[] = [
  // L3 (cx=300 cy=272 r=30) — no shift
  { id: "C_L3", polygon: "300,242 326,257 326,287 300,302 274,287 274,257" },
  // L2 (rotated -45°, cx=360 cy=380 r=48) — no shift
  { id: "C_L2", polygon: "326,346 372,334 406,368 394,414 348,426 314,392" },
  // L1 (cx=420 cy=508 r=55) — shifted +40
  { id: "C_L1", polygon: "420,453 468,481 468,536 420,563 372,536 372,481" },

  // GEM center — shifted +80
  { id: "C_DI", polygon: "440,605 560,605 565,645 500,680 435,645" },

  // R1 (cx=580 cy=508 r=55) — shifted +40
  { id: "C_R1", polygon: "580,453 628,481 628,536 580,563 532,536 532,481" },
  // R2 (rotated 45° CW, cx=640 cy=380 r=48) — no shift
  { id: "C_R2", polygon: "674,346 686,392 652,426 606,414 594,368 628,334" },
  // R3 (cx=700 cy=272 r=30) — no shift
  { id: "C_R3", polygon: "700,242 726,257 726,287 700,302 674,287 674,257" },

  // Corridor passages — extend INTO hexes on both ends (hex overlay hides overlap)
  // L3(300,290) → L2(350,345)
  { id: "C_cL3L2", polygon: "307,284 293,296 343,351 357,339" },
  // L2(360,415) → L1(420,460)
  { id: "C_cL2L1", polygon: "365,408 355,422 415,467 425,453" },
  // L1(420,555) → Gem(445,610)
  { id: "C_cL1DI", polygon: "428,552 412,560 437,614 453,606" },
  // R3(700,290) → R2(650,345)
  { id: "C_cR3R2", polygon: "693,284 707,296 657,351 643,339" },
  // R2(640,415) → R1(580,460)
  { id: "C_cR2R1", polygon: "635,408 645,422 585,467 575,453" },
  // R1(580,555) → Gem(555,610)
  { id: "C_cR1DI", polygon: "572,552 588,560 563,614 547,606" },
]

export const C_FILL = "#dbeafe"
export const C_STROKE = "#2563eb"

// ── CONNECTORS ──────────────────────────────────────────────

export const CONNECTORS: ConnectorDef[] = [
  // E bottom → L3 top (no shift)
  { id: "conn_E_C", polygon: "235,245 265,245 326,255 274,255", fill: "#d4dff7" },
  // A bottom → R3 top (no shift)
  { id: "conn_A_C", polygon: "735,245 765,245 726,255 674,255", fill: "#d4dff7" },
  // Gem lower-left → D (shifted +80)
  { id: "conn_C_D", polygon: "438,642 448,652 375,740 360,725", fill: "#e8dfc7" },
  // Gem lower-right → B (shifted +80)
  { id: "conn_C_B", polygon: "552,652 562,642 640,725 625,740", fill: "#e8dfc7" },
]

// ── DECORATIVE INNER HEXAGONS ───────────────────────────────

export const C_HEXAGONS: HexDef[] = [
  { cx: 300, cy: 272, r: 16 },   // L3 — no shift
  { cx: 360, cy: 380, r: 22 },   // L2 — no shift
  { cx: 420, cy: 508, r: 26 },   // L1 — +40
  { cx: 580, cy: 508, r: 26 },   // R1 — +40
  { cx: 640, cy: 380, r: 22 },   // R2 — no shift
  { cx: 700, cy: 272, r: 16 },   // R3 — no shift
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
  room: "#3b82f6", corridor: "#64748b", intersection: "#8b5cf6",
  entrance: "#10b981", stairs: "#ef4444", elevator: "#f97316",
}

// Category-based colors for richer node differentiation
export const CATEGORY_COLORS: Record<string, string> = {
  room: "#3b82f6",
  lab: "#8b5cf6",
  office: "#6366f1",
  canteen: "#f59e0b",
  water: "#06b6d4",
  washroom_male: "#0ea5e9",
  washroom_female: "#ec4899",
  sitting: "#a78bfa",
  stairs: "#ef4444",
  lift: "#f97316",
  entrance: "#10b981",
  electrical: "#eab308",
  stationary: "#78716c",
  corridor: "#64748b",
}
