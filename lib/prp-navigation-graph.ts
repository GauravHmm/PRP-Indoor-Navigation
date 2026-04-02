// ============================================================
// PRP Building — Navigation Graph
// Ground-truth aligned, category-tagged, stairs/lift separated
// ============================================================

export type NodeCategory =
  | "water" | "washroom_male" | "washroom_female"
  | "sitting" | "lab" | "office" | "canteen"
  | "stairs" | "lift" | "electrical" | "stationary"
  | "general"

export interface NavNode {
  id: string; x: number; y: number; floor: number; block: string
  type: "room" | "corridor" | "intersection" | "stairs" | "elevator" | "entrance"
  name: string; description?: string
  category?: NodeCategory
}
export interface NavEdge {
  from: string; to: string; distance: number; floor: number
  type: "corridor" | "stairs" | "elevator"
}

// ═══ E BLOCK ═══
// Hex: (250,55)(320,95)(320,210)(250,250)(180,210)(180,95)

const E_NODES: NavNode[] = [
  { id: "E2", x: 185, y: 152, floor: 1, block: "E", type: "entrance", name: "E2", description: "left" },
  { id: "E1", x: 315, y: 152, floor: 1, block: "E", type: "entrance", name: "E1", description: "right" },
  { id: "E_it", x: 250, y: 72, floor: 1, block: "E", type: "intersection", name: "E" },
  { id: "E_ib", x: 250, y: 235, floor: 1, block: "E", type: "intersection", name: "E" },
  // Left wall corridor (follows hex left contour)
  { id: "E_lc1", x: 200, y: 98, floor: 1, block: "E", type: "corridor", name: "E" },
  { id: "E_lc2", x: 195, y: 125, floor: 1, block: "E", type: "corridor", name: "E" },
  { id: "E_lc3", x: 190, y: 152, floor: 1, block: "E", type: "corridor", name: "E" },
  { id: "E_lc4", x: 190, y: 180, floor: 1, block: "E", type: "corridor", name: "E" },
  { id: "E_lc5", x: 200, y: 205, floor: 1, block: "E", type: "corridor", name: "E" },
  // Right wall corridor
  { id: "E_rc1", x: 300, y: 98, floor: 1, block: "E", type: "corridor", name: "E" },
  { id: "E_rc2", x: 305, y: 125, floor: 1, block: "E", type: "corridor", name: "E" },
  { id: "E_rc3", x: 310, y: 152, floor: 1, block: "E", type: "corridor", name: "E" },
  { id: "E_rc4", x: 310, y: 180, floor: 1, block: "E", type: "corridor", name: "E" },
  { id: "E_rc5", x: 300, y: 205, floor: 1, block: "E", type: "corridor", name: "E" },
  // Rooms/services around perimeter
  // Stairs & Lifts (separated)
  { id: "E_stairs_t", x: 250, y: 62, floor: 1, block: "E", type: "stairs", name: "Stairs", description: "top, E block", category: "stairs" },
  { id: "E_lift_t", x: 238, y: 68, floor: 1, block: "E", type: "elevator", name: "Lift", description: "top, E block", category: "lift" },
  { id: "E_stairs_r", x: 315, y: 110, floor: 1, block: "E", type: "stairs", name: "Stairs", description: "right, E block", category: "stairs" },
  { id: "E_lift_r", x: 318, y: 118, floor: 1, block: "E", type: "elevator", name: "Lift", description: "right, E block", category: "lift" },
  { id: "E_stairs_ll", x: 185, y: 190, floor: 1, block: "E", type: "stairs", name: "Stairs", description: "lower left, E block", category: "stairs" },
  { id: "E_lift_ll", x: 182, y: 198, floor: 1, block: "E", type: "elevator", name: "Lift", description: "lower left, E block", category: "lift" },
  // Rooms
  { id: "E_G54", x: 218, y: 78, floor: 1, block: "E", type: "room", name: "G54", category: "general" },
  { id: "E_G34", x: 185, y: 110, floor: 1, block: "E", type: "room", name: "G34", category: "general" },
  { id: "E_G33", x: 185, y: 135, floor: 1, block: "E", type: "room", name: "G33", category: "general" },
  { id: "E_G37", x: 315, y: 130, floor: 1, block: "E", type: "room", name: "G37", category: "general" },
  { id: "E_G32", x: 185, y: 165, floor: 1, block: "E", type: "room", name: "G32", category: "general" },
  { id: "E_G31", x: 185, y: 198, floor: 1, block: "E", type: "room", name: "G31", category: "general" },
  { id: "E_G41", x: 315, y: 195, floor: 1, block: "E", type: "room", name: "G41", description: "Faculty Cabins", category: "office" },
  { id: "E_G30", x: 218, y: 225, floor: 1, block: "E", type: "room", name: "G30", category: "general" },
  { id: "E_G20", x: 272, y: 225, floor: 1, block: "E", type: "room", name: "G20", category: "general" },
  // Sitting areas
  { id: "E_sit1", x: 250, y: 120, floor: 1, block: "E", type: "room", name: "Sitting Area", description: "upper, E block", category: "sitting" },
  { id: "E_sit2", x: 250, y: 185, floor: 1, block: "E", type: "room", name: "Sitting Area", description: "lower, E block", category: "sitting" },
]

// ═══ A BLOCK ═══
// Hex: (750,55)(820,95)(820,210)(750,250)(680,210)(680,95)
// LEFT (A1): G49,G48 above entrance; G45,G44 below; stairs/lift on both sides of A1
// RIGHT (A2): G51,G52 above entrance; G53,G54 below
// CENTER: two sitting areas. Straight path A1→A2.

const A_NODES: NavNode[] = [
  // Entrances
  { id: "A1", x: 685, y: 152, floor: 1, block: "A", type: "entrance", name: "A1", description: "left entrance" },
  { id: "A2", x: 815, y: 152, floor: 1, block: "A", type: "entrance", name: "A2", description: "right entrance" },
  // Top & bottom intersections
  { id: "A_it", x: 750, y: 72, floor: 1, block: "A", type: "intersection", name: "A" },
  { id: "A_ib", x: 750, y: 235, floor: 1, block: "A", type: "intersection", name: "A" },
  // Left wall corridor
  { id: "A_lc1", x: 700, y: 98, floor: 1, block: "A", type: "corridor", name: "A" },
  { id: "A_lc2", x: 695, y: 125, floor: 1, block: "A", type: "corridor", name: "A" },
  { id: "A_lc3", x: 690, y: 152, floor: 1, block: "A", type: "corridor", name: "A" },
  { id: "A_lc4", x: 695, y: 180, floor: 1, block: "A", type: "corridor", name: "A" },
  { id: "A_lc5", x: 700, y: 205, floor: 1, block: "A", type: "corridor", name: "A" },
  // Right wall corridor
  { id: "A_rc1", x: 800, y: 98, floor: 1, block: "A", type: "corridor", name: "A" },
  { id: "A_rc2", x: 805, y: 120, floor: 1, block: "A", type: "corridor", name: "A" },
  { id: "A_rc3", x: 810, y: 152, floor: 1, block: "A", type: "corridor", name: "A" },
  { id: "A_rc4", x: 810, y: 172, floor: 1, block: "A", type: "corridor", name: "A" },
  { id: "A_rc5", x: 805, y: 192, floor: 1, block: "A", type: "corridor", name: "A" },
  { id: "A_rc6", x: 800, y: 208, floor: 1, block: "A", type: "corridor", name: "A" },
  // Horizontal mid-corridor (A1→A2 straight path)
  { id: "A_mc1", x: 720, y: 152, floor: 1, block: "A", type: "corridor", name: "A" },
  { id: "A_mc2", x: 750, y: 152, floor: 1, block: "A", type: "corridor", name: "A" },
  { id: "A_mc3", x: 780, y: 152, floor: 1, block: "A", type: "corridor", name: "A" },
  // Stairs & Lifts (separated)
  { id: "A_stairs_t", x: 750, y: 62, floor: 1, block: "A", type: "stairs", name: "Stairs", description: "back left, A block", category: "stairs" },
  { id: "A_lift_t", x: 762, y: 68, floor: 1, block: "A", type: "elevator", name: "Lift", description: "back left, A block", category: "lift" },
  { id: "A_stairs_ul", x: 685, y: 118, floor: 1, block: "A", type: "stairs", name: "Stairs", description: "front left, A block", category: "stairs" },
  { id: "A_lift_ul", x: 682, y: 126, floor: 1, block: "A", type: "elevator", name: "Lift", description: "front left, A block", category: "lift" },
  { id: "A_stairs_ll", x: 685, y: 185, floor: 1, block: "A", type: "stairs", name: "Stairs", description: "back right, A block", category: "stairs" },
  { id: "A_lift_ll", x: 682, y: 193, floor: 1, block: "A", type: "elevator", name: "Lift", description: "back right, A block", category: "lift" },
  // LEFT side rooms (A1 side — back)
  { id: "A_G49", x: 688, y: 100, floor: 1, block: "A", type: "room", name: "G49", category: "general" },
  { id: "A_G48", x: 685, y: 108, floor: 1, block: "A", type: "room", name: "G48", category: "general" },
  { id: "A_G45", x: 688, y: 195, floor: 1, block: "A", type: "room", name: "G45", category: "general" },
  { id: "A_G44", x: 695, y: 210, floor: 1, block: "A", type: "room", name: "G44", category: "general" },
  // RIGHT side rooms (A2 side — front, top→bottom)
  { id: "A_G51", x: 815, y: 118, floor: 1, block: "A", type: "room", name: "G51", description: "Biosafety Level-II Lab", category: "lab" },
  { id: "A_G52", x: 815, y: 136, floor: 1, block: "A", type: "room", name: "G52", description: "Molecular Technology Lab", category: "lab" },
  { id: "A_G53", x: 815, y: 172, floor: 1, block: "A", type: "room", name: "G53", description: "Genomics & Bioinformatics Lab", category: "lab" },
  { id: "A_G54", x: 815, y: 192, floor: 1, block: "A", type: "room", name: "G54", description: "Phage Directory Lab", category: "lab" },
  // Sitting areas
  { id: "A_sit1", x: 750, y: 120, floor: 1, block: "A", type: "room", name: "Sitting Area", description: "upper, A block", category: "sitting" },
  { id: "A_sit2", x: 750, y: 185, floor: 1, block: "A", type: "room", name: "Sitting Area", description: "lower, A block", category: "sitting" },
  // Bottom
  { id: "A_G43", x: 780, y: 225, floor: 1, block: "A", type: "room", name: "G43", description: "Men's Washroom", category: "washroom_male" },
]

// ═══ C BLOCK ═══

const C_NODES: NavNode[] = [
  { id: "C_entE", x: 300, y: 248, floor: 1, block: "C", type: "entrance", name: "To E Block" },
  { id: "C_entA", x: 700, y: 248, floor: 1, block: "C", type: "entrance", name: "To A Block" },
  { id: "C1", x: 500, y: 530, floor: 1, block: "C", type: "entrance", name: "C1 Entrance", description: "main courtyard" },
  { id: "C3", x: 375, y: 468, floor: 1, block: "C", type: "entrance", name: "C3 Entrance", description: "left" },
  { id: "C_entB", x: 560, y: 572, floor: 1, block: "C", type: "entrance", name: "To B Block" },
  { id: "C_entD", x: 440, y: 572, floor: 1, block: "C", type: "entrance", name: "To D Block" },

  // ── R3 HEX — A-side connector: G01(W-WR), G02(M-WR), Stairs, Lift ──
  { id: "R3t", x: 700, y: 248, floor: 1, block: "C", type: "intersection", name: "R3" },
  { id: "R3c", x: 700, y: 272, floor: 1, block: "C", type: "corridor", name: "R3" },
  { id: "R3b", x: 700, y: 298, floor: 1, block: "C", type: "intersection", name: "R3" },
  { id: "R3_G01", x: 722, y: 262, floor: 1, block: "C", type: "room", name: "G01", description: "Women's Washroom", category: "washroom_female" },
  { id: "R3_G02", x: 722, y: 278, floor: 1, block: "C", type: "room", name: "G02", description: "Men's Washroom", category: "washroom_male" },
  { id: "R3_stairs", x: 722, y: 290, floor: 1, block: "C", type: "stairs", name: "Stairs", description: "A-C connector", category: "stairs" },
  { id: "R3_lift", x: 718, y: 295, floor: 1, block: "C", type: "elevator", name: "Lift", description: "A-C connector", category: "lift" },

  // Corridor R3→R2
  { id: "cP", x: 688, y: 304, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cP2", x: 678, y: 312, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cQ", x: 668, y: 320, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cQ2", x: 658, y: 328, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cR", x: 648, y: 336, floor: 1, block: "C", type: "corridor", name: "c" },

  // ── R2 HEX (HEX 1) — Right: G03,G04; Left: G05(Elec),G06 ──
  { id: "R2t", x: 640, y: 340, floor: 1, block: "C", type: "intersection", name: "R2" },
  { id: "R2b", x: 640, y: 420, floor: 1, block: "C", type: "intersection", name: "R2" },
  { id: "R2_lc1", x: 615, y: 358, floor: 1, block: "C", type: "corridor", name: "R2" },
  { id: "R2_lc2", x: 608, y: 380, floor: 1, block: "C", type: "corridor", name: "R2" },
  { id: "R2_lc3", x: 615, y: 405, floor: 1, block: "C", type: "corridor", name: "R2" },
  { id: "R2_rc1", x: 668, y: 355, floor: 1, block: "C", type: "corridor", name: "R2" },
  { id: "R2_rc2", x: 675, y: 380, floor: 1, block: "C", type: "corridor", name: "R2" },
  { id: "R2_rc3", x: 668, y: 405, floor: 1, block: "C", type: "corridor", name: "R2" },
  { id: "R2_G05", x: 602, y: 365, floor: 1, block: "C", type: "room", name: "G05", description: "Electrical Room", category: "electrical" },
  { id: "R2_G06", x: 600, y: 398, floor: 1, block: "C", type: "room", name: "G06", category: "general" },
  { id: "R2_G03", x: 680, y: 365, floor: 1, block: "C", type: "room", name: "G03", category: "general" },
  { id: "R2_G04", x: 675, y: 405, floor: 1, block: "C", type: "room", name: "G04", category: "general" },

  // Corridor R2→R1 + Water + G09
  { id: "cM", x: 618, y: 412, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cM2", x: 612, y: 415, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cN", x: 604, y: 418, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "R1R2_w", x: 600, y: 412, floor: 1, block: "C", type: "room", name: "Water", description: "drinking water", category: "water" },
  { id: "cN2", x: 596, y: 418, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cO", x: 588, y: 418, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "C_G09", x: 592, y: 425, floor: 1, block: "C", type: "room", name: "G09", description: "Canteen", category: "canteen" },

  // ── R1 HEX (HEX 2) — Right: G07(Chem),G08; Left: G10,G11; Stairs,Lift ──
  { id: "R1t", x: 580, y: 422, floor: 1, block: "C", type: "intersection", name: "R1" },
  { id: "R1b", x: 580, y: 508, floor: 1, block: "C", type: "intersection", name: "R1" },
  { id: "R1_lc1", x: 555, y: 445, floor: 1, block: "C", type: "corridor", name: "R1" },
  { id: "R1_lc2", x: 550, y: 468, floor: 1, block: "C", type: "corridor", name: "R1" },
  { id: "R1_lc3", x: 555, y: 492, floor: 1, block: "C", type: "corridor", name: "R1" },
  { id: "R1_rc1", x: 608, y: 445, floor: 1, block: "C", type: "corridor", name: "R1" },
  { id: "R1_rc2", x: 612, y: 468, floor: 1, block: "C", type: "corridor", name: "R1" },
  { id: "R1_rc3", x: 608, y: 492, floor: 1, block: "C", type: "corridor", name: "R1" },
  { id: "R1_G10", x: 540, y: 448, floor: 1, block: "C", type: "room", name: "G10", category: "general" },
  { id: "R1_G11", x: 538, y: 488, floor: 1, block: "C", type: "room", name: "G11", category: "general" },
  { id: "R1_G07", x: 622, y: 460, floor: 1, block: "C", type: "room", name: "G07", description: "Chemistry Lab", category: "lab" },
  { id: "R1_G08", x: 618, y: 490, floor: 1, block: "C", type: "room", name: "G08", category: "general" },
  { id: "R1_stairs", x: 538, y: 500, floor: 1, block: "C", type: "stairs", name: "Stairs", description: "HEX 2", category: "stairs" },
  { id: "R1_lift", x: 530, y: 505, floor: 1, block: "C", type: "elevator", name: "Lift", description: "HEX 2", category: "lift" },

  // Corridor R1→Gem
  { id: "cJ", x: 578, y: 512, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cJ2", x: 574, y: 516, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cK", x: 570, y: 520, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cK2", x: 566, y: 522, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cL", x: 562, y: 525, floor: 1, block: "C", type: "corridor", name: "c" },

  // ── GEM (Main Block) — Stairs, G14, G15/G16, Stat, Lift ──
  { id: "Dt", x: 500, y: 530, floor: 1, block: "C", type: "intersection", name: "Gem" },
  { id: "Dc1", x: 500, y: 545, floor: 1, block: "C", type: "corridor", name: "Gem" },
  { id: "Dm", x: 500, y: 558, floor: 1, block: "C", type: "intersection", name: "Gem" },
  { id: "Dc2", x: 500, y: 575, floor: 1, block: "C", type: "corridor", name: "Gem" },
  { id: "Dl", x: 445, y: 548, floor: 1, block: "C", type: "intersection", name: "Gem L" },
  { id: "Dr", x: 555, y: 548, floor: 1, block: "C", type: "intersection", name: "Gem R" },
  { id: "Gem_stairs", x: 520, y: 535, floor: 1, block: "C", type: "stairs", name: "Stairs", description: "main block", category: "stairs" },
  { id: "Gem_lift", x: 475, y: 578, floor: 1, block: "C", type: "elevator", name: "Lift", description: "main block", category: "lift" },
  { id: "C_stat", x: 448, y: 532, floor: 1, block: "C", type: "room", name: "Stationary", category: "stationary" },
  { id: "C_G14", x: 548, y: 535, floor: 1, block: "C", type: "room", name: "G14", description: "Scope School Office", category: "office" },
  { id: "C_G16", x: 460, y: 568, floor: 1, block: "C", type: "room", name: "G16", description: "Centre for Clean Environment", category: "general" },
  { id: "C_G15", x: 525, y: 568, floor: 1, block: "C", type: "room", name: "G15", description: "Centre for Clean Environment", category: "general" },

  // Corridor Gem→L1
  { id: "cG", x: 438, y: 525, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cG2", x: 434, y: 522, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cH", x: 430, y: 520, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cH2", x: 426, y: 516, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cI", x: 422, y: 512, floor: 1, block: "C", type: "corridor", name: "c" },

  // ── L1 HEX (Next Hex) — Left: G20(Faculty),G21; Right: G18(Physics),G17(Eng Physics) ──
  { id: "L1t", x: 420, y: 422, floor: 1, block: "C", type: "intersection", name: "L1" },
  { id: "L1b", x: 420, y: 508, floor: 1, block: "C", type: "intersection", name: "L1" },
  { id: "L1_lc1", x: 395, y: 445, floor: 1, block: "C", type: "corridor", name: "L1" },
  { id: "L1_lc2", x: 390, y: 468, floor: 1, block: "C", type: "corridor", name: "L1" },
  { id: "L1_lc3", x: 395, y: 492, floor: 1, block: "C", type: "corridor", name: "L1" },
  { id: "L1_rc1", x: 448, y: 445, floor: 1, block: "C", type: "corridor", name: "L1" },
  { id: "L1_rc2", x: 452, y: 468, floor: 1, block: "C", type: "corridor", name: "L1" },
  { id: "L1_rc3", x: 448, y: 492, floor: 1, block: "C", type: "corridor", name: "L1" },
  { id: "C_G20", x: 378, y: 448, floor: 1, block: "C", type: "room", name: "G20", description: "Faculty Cabins", category: "office" },
  { id: "C_G21", x: 378, y: 490, floor: 1, block: "C", type: "room", name: "G21", category: "general" },
  { id: "C_G18", x: 462, y: 450, floor: 1, block: "C", type: "room", name: "G18", description: "Physics Research Lab", category: "lab" },
  { id: "C_G17", x: 462, y: 480, floor: 1, block: "C", type: "room", name: "G17", description: "Engineering Physics Lab", category: "lab" },

  // Corridor L1→L2 + G22(Canteen) + Water + C3
  { id: "cD", x: 415, y: 428, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cD2", x: 405, y: 430, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cE", x: 394, y: 428, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "L2L1_w", x: 388, y: 420, floor: 1, block: "C", type: "room", name: "Water", description: "drinking water", category: "water" },
  { id: "C_G22", x: 400, y: 435, floor: 1, block: "C", type: "room", name: "G22", description: "Canteen", category: "canteen" },
  { id: "cE2", x: 382, y: 425, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cF", x: 370, y: 422, floor: 1, block: "C", type: "corridor", name: "c" },

  // ── L2 HEX (Final Hex) — Left: G23,Electrical; Right: G24,G25,G26 ──
  { id: "L2t", x: 360, y: 340, floor: 1, block: "C", type: "intersection", name: "L2" },
  { id: "L2b", x: 360, y: 420, floor: 1, block: "C", type: "intersection", name: "L2" },
  { id: "L2_lc1", x: 335, y: 358, floor: 1, block: "C", type: "corridor", name: "L2" },
  { id: "L2_lc2", x: 328, y: 380, floor: 1, block: "C", type: "corridor", name: "L2" },
  { id: "L2_lc3", x: 335, y: 405, floor: 1, block: "C", type: "corridor", name: "L2" },
  { id: "L2_rc1", x: 385, y: 355, floor: 1, block: "C", type: "corridor", name: "L2" },
  { id: "L2_rc2", x: 392, y: 380, floor: 1, block: "C", type: "corridor", name: "L2" },
  { id: "L2_rc3", x: 385, y: 405, floor: 1, block: "C", type: "corridor", name: "L2" },
  { id: "C_G23", x: 320, y: 365, floor: 1, block: "C", type: "room", name: "G23", category: "general" },
  { id: "L2_elec", x: 318, y: 395, floor: 1, block: "C", type: "room", name: "Electrical Room", description: "Final Hex", category: "electrical" },
  { id: "C_G26", x: 400, y: 358, floor: 1, block: "C", type: "room", name: "G26", category: "general" },
  { id: "C_G25", x: 395, y: 380, floor: 1, block: "C", type: "room", name: "G25", category: "general" },
  { id: "C_G24", x: 395, y: 400, floor: 1, block: "C", type: "room", name: "G24", category: "general" },

  // Corridor L2→L3
  { id: "cA", x: 346, y: 334, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cA2", x: 336, y: 326, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cB", x: 326, y: 318, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cB2", x: 316, y: 310, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cC", x: 306, y: 302, floor: 1, block: "C", type: "corridor", name: "c" },

  // ── L3 HEX — E-side connector: G28(W-WR), G27(M-WR), Stairs, Lift ──
  { id: "L3t", x: 300, y: 248, floor: 1, block: "C", type: "intersection", name: "L3" },
  { id: "L3c", x: 300, y: 272, floor: 1, block: "C", type: "corridor", name: "L3" },
  { id: "L3b", x: 300, y: 298, floor: 1, block: "C", type: "intersection", name: "L3" },
  { id: "L3_G28", x: 278, y: 265, floor: 1, block: "C", type: "room", name: "G28", description: "Women's Washroom", category: "washroom_female" },
  { id: "L3_G27", x: 278, y: 280, floor: 1, block: "C", type: "room", name: "G27", description: "Men's Washroom", category: "washroom_male" },
  { id: "L3_stairs", x: 322, y: 272, floor: 1, block: "C", type: "stairs", name: "Stairs", description: "E-C connector", category: "stairs" },
  { id: "L3_lift", x: 318, y: 278, floor: 1, block: "C", type: "elevator", name: "Lift", description: "E-C connector", category: "lift" },
]



// ═══ D BLOCK (with stairs on path, lift behind) ═══
const D_NODES: NavNode[] = [
  { id: "Db_en", x: 375, y: 660, floor: 1, block: "D", type: "entrance", name: "D from C" },
  { id: "Db_ex", x: 310, y: 660, floor: 1, block: "D", type: "entrance", name: "D External" },
  // More corridor nodes for smooth path
  { id: "Db_c0", x: 370, y: 665, floor: 1, block: "D", type: "corridor", name: "D" },
  { id: "Db_i1", x: 362, y: 674, floor: 1, block: "D", type: "intersection", name: "D" },
  { id: "Db_c1", x: 355, y: 682, floor: 1, block: "D", type: "corridor", name: "D" },
  { id: "Db_i2", x: 348, y: 690, floor: 1, block: "D", type: "intersection", name: "D" },
  { id: "Db_c2", x: 340, y: 698, floor: 1, block: "D", type: "corridor", name: "D" },
  { id: "Db_i3", x: 332, y: 706, floor: 1, block: "D", type: "intersection", name: "D" },
  { id: "Db_c3", x: 325, y: 714, floor: 1, block: "D", type: "corridor", name: "D" },
  { id: "Db_i4", x: 318, y: 722, floor: 1, block: "D", type: "intersection", name: "D" },
  { id: "Db_c4", x: 312, y: 728, floor: 1, block: "D", type: "corridor", name: "D" },
  // Rooms around corridor
  { id: "D_G72", x: 345, y: 672, floor: 1, block: "D", type: "room", name: "G72", description: "Canteen", category: "canteen" },
  { id: "Db_sl", x: 335, y: 690, floor: 1, block: "D", type: "stairs", name: "Stairs", description: "on path" },
  { id: "Db_lf", x: 325, y: 695, floor: 1, block: "D", type: "elevator", name: "Lift", description: "behind stairs" },
  { id: "D_G68", x: 338, y: 718, floor: 1, block: "D", type: "room", name: "G68" },
]

// ═══ B BLOCK (with stairs on path, lift behind) ═══
const B_NODES: NavNode[] = [
  { id: "Bb_en", x: 625, y: 660, floor: 1, block: "B", type: "entrance", name: "B from C" },
  { id: "Bb_ex", x: 645, y: 738, floor: 1, block: "B", type: "entrance", name: "B External" },
  // More corridor nodes
  { id: "Bb_c0", x: 632, y: 665, floor: 1, block: "B", type: "corridor", name: "B" },
  { id: "Bb_i1", x: 640, y: 674, floor: 1, block: "B", type: "intersection", name: "B" },
  { id: "Bb_c1", x: 645, y: 682, floor: 1, block: "B", type: "corridor", name: "B" },
  { id: "Bb_i2", x: 652, y: 690, floor: 1, block: "B", type: "intersection", name: "B" },
  { id: "Bb_c2", x: 658, y: 698, floor: 1, block: "B", type: "corridor", name: "B" },
  { id: "Bb_i3", x: 665, y: 706, floor: 1, block: "B", type: "intersection", name: "B" },
  { id: "Bb_c3", x: 672, y: 714, floor: 1, block: "B", type: "corridor", name: "B" },
  { id: "Bb_i4", x: 678, y: 722, floor: 1, block: "B", type: "intersection", name: "B" },
  { id: "Bb_c4", x: 684, y: 728, floor: 1, block: "B", type: "corridor", name: "B" },
  // Rooms around corridor
  { id: "B_G60", x: 648, y: 670, floor: 1, block: "B", type: "room", name: "G60", description: "Exam Hall + Faculty Cabins", category: "office" },
  { id: "B_G61", x: 655, y: 680, floor: 1, block: "B", type: "room", name: "G61" },
  { id: "B_mr", x: 660, y: 686, floor: 1, block: "B", type: "room", name: "Men's Washroom", category: "washroom_male" },
  { id: "Bb_sl", x: 665, y: 694, floor: 1, block: "B", type: "stairs", name: "Stairs", description: "on path" },
  { id: "Bb_lf", x: 675, y: 698, floor: 1, block: "B", type: "elevator", name: "Lift", description: "behind stairs" },
  { id: "B_G67", x: 658, y: 712, floor: 1, block: "B", type: "room", name: "G67" },
  { id: "B_wr", x: 680, y: 725, floor: 1, block: "B", type: "room", name: "Women's Washroom", category: "washroom_female" },
]

export const navNodes: NavNode[] = [...E_NODES, ...A_NODES, ...C_NODES, ...D_NODES, ...B_NODES]

// ── EDGES ──

export const navEdges: NavEdge[] = [
  // ═══ E BLOCK ═══
  { from:"E_it",to:"E_lc1",distance:16,floor:1,type:"corridor" },
  { from:"E_it",to:"E_rc1",distance:16,floor:1,type:"corridor" },
  ...[["E_lc1","E_lc2"],["E_lc2","E_lc3"],["E_lc3","E_lc4"],["E_lc4","E_lc5"]].map(
    ([a,b])=>({from:a,to:b,distance:28,floor:1,type:"corridor" as const})),
  { from:"E_lc5",to:"E_ib",distance:20,floor:1,type:"corridor" },
  ...[["E_rc1","E_rc2"],["E_rc2","E_rc3"],["E_rc3","E_rc4"],["E_rc4","E_rc5"]].map(
    ([a,b])=>({from:a,to:b,distance:28,floor:1,type:"corridor" as const})),
  { from:"E_rc5",to:"E_ib",distance:20,floor:1,type:"corridor" },
  { from:"E_lc1",to:"E_rc1",distance:100,floor:1,type:"corridor" },
  { from:"E_lc3",to:"E_rc3",distance:120,floor:1,type:"corridor" },
  { from:"E1",to:"E_rc3",distance:8,floor:1,type:"corridor" },
  { from:"E2",to:"E_lc3",distance:8,floor:1,type:"corridor" },
  // Stairs & lifts
  { from:"E_stairs_t",to:"E_it",distance:8,floor:1,type:"corridor" },
  { from:"E_lift_t",to:"E_stairs_t",distance:5,floor:1,type:"corridor" },
  { from:"E_stairs_r",to:"E_rc2",distance:8,floor:1,type:"corridor" },
  { from:"E_lift_r",to:"E_stairs_r",distance:5,floor:1,type:"corridor" },
  { from:"E_stairs_ll",to:"E_lc4",distance:8,floor:1,type:"corridor" },
  { from:"E_lift_ll",to:"E_stairs_ll",distance:5,floor:1,type:"corridor" },
  // Rooms
  { from:"E_G54",to:"E_lc1",distance:10,floor:1,type:"corridor" },
  { from:"E_G34",to:"E_lc2",distance:8,floor:1,type:"corridor" },
  { from:"E_G33",to:"E_lc2",distance:8,floor:1,type:"corridor" },
  { from:"E_G37",to:"E_rc2",distance:8,floor:1,type:"corridor" },
  { from:"E_G32",to:"E_lc3",distance:8,floor:1,type:"corridor" },
  { from:"E_G31",to:"E_lc4",distance:8,floor:1,type:"corridor" },
  { from:"E_G41",to:"E_rc4",distance:8,floor:1,type:"corridor" },
  { from:"E_G30",to:"E_lc5",distance:8,floor:1,type:"corridor" },
  { from:"E_G20",to:"E_rc5",distance:8,floor:1,type:"corridor" },
  // Sitting areas
  { from:"E_sit1",to:"E_lc2",distance:15,floor:1,type:"corridor" },
  { from:"E_sit2",to:"E_lc4",distance:15,floor:1,type:"corridor" },

  // ═══ A BLOCK ═══
  { from:"A_it",to:"A_lc1",distance:16,floor:1,type:"corridor" },
  ...[["A_lc1","A_lc2"],["A_lc2","A_lc3"],["A_lc3","A_lc4"],["A_lc4","A_lc5"]].map(
    ([a,b])=>({from:a,to:b,distance:28,floor:1,type:"corridor" as const})),
  { from:"A_lc5",to:"A_ib",distance:20,floor:1,type:"corridor" },
  { from:"A_it",to:"A_rc1",distance:16,floor:1,type:"corridor" },
  ...[["A_rc1","A_rc2"],["A_rc2","A_rc3"],["A_rc3","A_rc4"],["A_rc4","A_rc5"],["A_rc5","A_rc6"]].map(
    ([a,b])=>({from:a,to:b,distance:22,floor:1,type:"corridor" as const})),
  { from:"A_rc6",to:"A_ib",distance:20,floor:1,type:"corridor" },
  { from:"A_lc3",to:"A_mc1",distance:30,floor:1,type:"corridor" },
  { from:"A_mc1",to:"A_mc2",distance:30,floor:1,type:"corridor" },
  { from:"A_mc2",to:"A_mc3",distance:30,floor:1,type:"corridor" },
  { from:"A_mc3",to:"A_rc3",distance:30,floor:1,type:"corridor" },
  { from:"A_lc1",to:"A_rc1",distance:100,floor:1,type:"corridor" },
  // Stairs & lifts
  { from:"A_stairs_t",to:"A_it",distance:8,floor:1,type:"corridor" },
  { from:"A_lift_t",to:"A_stairs_t",distance:5,floor:1,type:"corridor" },
  { from:"A_stairs_ul",to:"A_lc2",distance:8,floor:1,type:"corridor" },
  { from:"A_lift_ul",to:"A_stairs_ul",distance:5,floor:1,type:"corridor" },
  { from:"A_stairs_ll",to:"A_lc4",distance:8,floor:1,type:"corridor" },
  { from:"A_lift_ll",to:"A_stairs_ll",distance:5,floor:1,type:"corridor" },
  // Entrances
  { from:"A1",to:"A_lc3",distance:8,floor:1,type:"corridor" },
  { from:"A2",to:"A_rc3",distance:8,floor:1,type:"corridor" },
  // Rooms
  { from:"A_G49",to:"A_lc1",distance:8,floor:1,type:"corridor" },
  { from:"A_G48",to:"A_lc1",distance:8,floor:1,type:"corridor" },
  { from:"A_G45",to:"A_lc4",distance:8,floor:1,type:"corridor" },
  { from:"A_G44",to:"A_lc5",distance:8,floor:1,type:"corridor" },
  { from:"A_G51",to:"A_rc2",distance:8,floor:1,type:"corridor" },
  { from:"A_G52",to:"A_rc3",distance:8,floor:1,type:"corridor" },
  { from:"A_G53",to:"A_rc4",distance:8,floor:1,type:"corridor" },
  { from:"A_G54",to:"A_rc5",distance:8,floor:1,type:"corridor" },
  { from:"A_sit1",to:"A_mc2",distance:15,floor:1,type:"corridor" },
  { from:"A_sit2",to:"A_mc2",distance:15,floor:1,type:"corridor" },
  { from:"A_G43",to:"A_ib",distance:8,floor:1,type:"corridor" },

  // ═══ C BLOCK ═══
  // R3 (A-side connector)
  { from:"C_entA",to:"R3t",distance:6,floor:1,type:"corridor" },
  { from:"R3t",to:"R3c",distance:28,floor:1,type:"corridor" },
  { from:"R3c",to:"R3b",distance:28,floor:1,type:"corridor" },
  { from:"R3_G01",to:"R3c",distance:8,floor:1,type:"corridor" },
  { from:"R3_G02",to:"R3c",distance:8,floor:1,type:"corridor" },
  { from:"R3_stairs",to:"R3c",distance:8,floor:1,type:"corridor" },
  { from:"R3_lift",to:"R3_stairs",distance:5,floor:1,type:"corridor" },
  // R3→R2
  ...[["R3b","cP"],["cP","cP2"],["cP2","cQ"],["cQ","cQ2"],["cQ2","cR"],["cR","R2t"]].map(
    ([a,b])=>({from:a,to:b,distance:8,floor:1,type:"corridor" as const})),
  // R2 (HEX 1)
  { from:"R2t",to:"R2_lc1",distance:14,floor:1,type:"corridor" },
  { from:"R2t",to:"R2_rc1",distance:14,floor:1,type:"corridor" },
  ...[["R2_lc1","R2_lc2"],["R2_lc2","R2_lc3"]].map(
    ([a,b])=>({from:a,to:b,distance:23,floor:1,type:"corridor" as const})),
  { from:"R2_lc3",to:"R2b",distance:14,floor:1,type:"corridor" },
  ...[["R2_rc1","R2_rc2"],["R2_rc2","R2_rc3"]].map(
    ([a,b])=>({from:a,to:b,distance:23,floor:1,type:"corridor" as const})),
  { from:"R2_rc3",to:"R2b",distance:14,floor:1,type:"corridor" },
  { from:"R2_lc1",to:"R2_rc1",distance:47,floor:1,type:"corridor" },
  { from:"R2_lc2",to:"R2_rc2",distance:53,floor:1,type:"corridor" },
  { from:"R2_G05",to:"R2_lc1",distance:8,floor:1,type:"corridor" },
  { from:"R2_G06",to:"R2_lc2",distance:8,floor:1,type:"corridor" },
  { from:"R2_G03",to:"R2_rc1",distance:8,floor:1,type:"corridor" },
  { from:"R2_G04",to:"R2_rc3",distance:8,floor:1,type:"corridor" },
  // R2→R1 + Water + G09
  ...[["R2b","cM"],["cM","cM2"],["cM2","cN"],["cN","cN2"],["cN2","cO"],["cO","R1t"]].map(
    ([a,b])=>({from:a,to:b,distance:8,floor:1,type:"corridor" as const})),
  { from:"R1R2_w",to:"cN",distance:6,floor:1,type:"corridor" },
  { from:"C_G09",to:"cO",distance:6,floor:1,type:"corridor" },
  // R1 (HEX 2)
  { from:"R1t",to:"R1_lc1",distance:16,floor:1,type:"corridor" },
  { from:"R1t",to:"R1_rc1",distance:16,floor:1,type:"corridor" },
  ...[["R1_lc1","R1_lc2"],["R1_lc2","R1_lc3"]].map(
    ([a,b])=>({from:a,to:b,distance:24,floor:1,type:"corridor" as const})),
  { from:"R1_lc3",to:"R1b",distance:16,floor:1,type:"corridor" },
  ...[["R1_rc1","R1_rc2"],["R1_rc2","R1_rc3"]].map(
    ([a,b])=>({from:a,to:b,distance:24,floor:1,type:"corridor" as const})),
  { from:"R1_rc3",to:"R1b",distance:16,floor:1,type:"corridor" },
  { from:"R1_lc1",to:"R1_rc1",distance:53,floor:1,type:"corridor" },
  { from:"R1_lc2",to:"R1_rc2",distance:62,floor:1,type:"corridor" },
  { from:"R1_G10",to:"R1_lc1",distance:8,floor:1,type:"corridor" },
  { from:"R1_G11",to:"R1_lc3",distance:8,floor:1,type:"corridor" },
  { from:"R1_G07",to:"R1_rc1",distance:8,floor:1,type:"corridor" },
  { from:"R1_G08",to:"R1_rc2",distance:8,floor:1,type:"corridor" },
  { from:"R1_stairs",to:"R1_lc2",distance:8,floor:1,type:"corridor" },
  { from:"R1_lift",to:"R1_stairs",distance:5,floor:1,type:"corridor" },
  // R1→Gem
  ...[["R1b","cJ"],["cJ","cJ2"],["cJ2","cK"],["cK","cK2"],["cK2","cL"],["cL","Dr"]].map(
    ([a,b])=>({from:a,to:b,distance:6,floor:1,type:"corridor" as const})),
  // Gem (Main Block)
  { from:"Dt",to:"Dc1",distance:15,floor:1,type:"corridor" },
  { from:"Dc1",to:"Dm",distance:13,floor:1,type:"corridor" },
  { from:"Dm",to:"Dc2",distance:17,floor:1,type:"corridor" },
  { from:"Dc2",to:"C1",distance:15,floor:1,type:"corridor" },
  { from:"Dl",to:"Dm",distance:18,floor:1,type:"corridor" },
  { from:"Dr",to:"Dm",distance:18,floor:1,type:"corridor" },
  { from:"Dt",to:"Dl",distance:22,floor:1,type:"corridor" },
  { from:"Dt",to:"Dr",distance:22,floor:1,type:"corridor" },
  { from:"C_stat",to:"Dl",distance:8,floor:1,type:"corridor" },
  { from:"C_G14",to:"Dr",distance:8,floor:1,type:"corridor" },
  { from:"C_G16",to:"Dc2",distance:8,floor:1,type:"corridor" },
  { from:"C_G15",to:"Dc2",distance:8,floor:1,type:"corridor" },
  { from:"C_G15",to:"C_G16",distance:5,floor:1,type:"corridor" },
  { from:"Gem_stairs",to:"Dt",distance:8,floor:1,type:"corridor" },
  { from:"Gem_lift",to:"Dc2",distance:8,floor:1,type:"corridor" },
  { from:"C_entB",to:"Dr",distance:10,floor:1,type:"corridor" },
  { from:"C_entD",to:"Dl",distance:10,floor:1,type:"corridor" },
  // Gem→L1
  ...[["Dl","cG"],["cG","cG2"],["cG2","cH"],["cH","cH2"],["cH2","cI"],["cI","L1b"]].map(
    ([a,b])=>({from:a,to:b,distance:6,floor:1,type:"corridor" as const})),
  // L1 (Next Hex)
  { from:"L1t",to:"L1_lc1",distance:16,floor:1,type:"corridor" },
  { from:"L1t",to:"L1_rc1",distance:16,floor:1,type:"corridor" },
  ...[["L1_lc1","L1_lc2"],["L1_lc2","L1_lc3"]].map(
    ([a,b])=>({from:a,to:b,distance:24,floor:1,type:"corridor" as const})),
  { from:"L1_lc3",to:"L1b",distance:16,floor:1,type:"corridor" },
  ...[["L1_rc1","L1_rc2"],["L1_rc2","L1_rc3"]].map(
    ([a,b])=>({from:a,to:b,distance:24,floor:1,type:"corridor" as const})),
  { from:"L1_rc3",to:"L1b",distance:16,floor:1,type:"corridor" },
  { from:"L1_lc1",to:"L1_rc1",distance:53,floor:1,type:"corridor" },
  { from:"L1_lc2",to:"L1_rc2",distance:62,floor:1,type:"corridor" },
  { from:"C_G20",to:"L1_lc1",distance:8,floor:1,type:"corridor" },
  { from:"C_G21",to:"L1_lc3",distance:8,floor:1,type:"corridor" },
  { from:"C_G18",to:"L1_rc1",distance:8,floor:1,type:"corridor" },
  { from:"C_G17",to:"L1_rc2",distance:8,floor:1,type:"corridor" },
  { from:"C3",to:"L1_lc2",distance:10,floor:1,type:"corridor" },
  // L1→L2 + Water + G22
  ...[["L1t","cD"],["cD","cD2"],["cD2","cE"],["cE","cE2"],["cE2","cF"],["cF","L2b"]].map(
    ([a,b])=>({from:a,to:b,distance:8,floor:1,type:"corridor" as const})),
  { from:"L2L1_w",to:"cE",distance:6,floor:1,type:"corridor" },
  { from:"C_G22",to:"cD2",distance:6,floor:1,type:"corridor" },
  // L2 (Final Hex)
  { from:"L2t",to:"L2_lc1",distance:14,floor:1,type:"corridor" },
  { from:"L2t",to:"L2_rc1",distance:14,floor:1,type:"corridor" },
  ...[["L2_lc1","L2_lc2"],["L2_lc2","L2_lc3"]].map(
    ([a,b])=>({from:a,to:b,distance:23,floor:1,type:"corridor" as const})),
  { from:"L2_lc3",to:"L2b",distance:14,floor:1,type:"corridor" },
  ...[["L2_rc1","L2_rc2"],["L2_rc2","L2_rc3"]].map(
    ([a,b])=>({from:a,to:b,distance:23,floor:1,type:"corridor" as const})),
  { from:"L2_rc3",to:"L2b",distance:14,floor:1,type:"corridor" },
  { from:"L2_lc1",to:"L2_rc1",distance:44,floor:1,type:"corridor" },
  { from:"L2_lc2",to:"L2_rc2",distance:50,floor:1,type:"corridor" },
  { from:"C_G23",to:"L2_lc1",distance:8,floor:1,type:"corridor" },
  { from:"L2_elec",to:"L2_lc2",distance:8,floor:1,type:"corridor" },
  { from:"C_G26",to:"L2_rc1",distance:8,floor:1,type:"corridor" },
  { from:"C_G25",to:"L2_rc2",distance:8,floor:1,type:"corridor" },
  { from:"C_G24",to:"L2_rc3",distance:8,floor:1,type:"corridor" },
  // L2→L3
  ...[["L2t","cA"],["cA","cA2"],["cA2","cB"],["cB","cB2"],["cB2","cC"],["cC","L3b"]].map(
    ([a,b])=>({from:a,to:b,distance:8,floor:1,type:"corridor" as const})),
  // L3 (E-side connector)
  { from:"C_entE",to:"L3t",distance:6,floor:1,type:"corridor" },
  { from:"L3t",to:"L3c",distance:28,floor:1,type:"corridor" },
  { from:"L3c",to:"L3b",distance:28,floor:1,type:"corridor" },
  { from:"L3_G28",to:"L3c",distance:8,floor:1,type:"corridor" },
  { from:"L3_G27",to:"L3c",distance:8,floor:1,type:"corridor" },
  { from:"L3_stairs",to:"L3c",distance:8,floor:1,type:"corridor" },
  { from:"L3_lift",to:"L3_stairs",distance:5,floor:1,type:"corridor" },
  // Inter-block
  { from:"C_entE",to:"E_ib",distance:30,floor:1,type:"corridor" },
  { from:"C_entA",to:"A_ib",distance:30,floor:1,type:"corridor" },
  { from:"C_entD",to:"Db_en",distance:50,floor:1,type:"corridor" },
  { from:"C_entB",to:"Bb_en",distance:50,floor:1,type:"corridor" },

  // ═══ D BLOCK ═══
  ...[["Db_en","Db_c0"],["Db_c0","Db_i1"],["Db_i1","Db_c1"],["Db_c1","Db_i2"],
      ["Db_i2","Db_c2"],["Db_c2","Db_i3"],["Db_i3","Db_c3"],["Db_c3","Db_i4"],
      ["Db_i4","Db_c4"],["Db_c4","Db_ex"]].map(
    ([a,b])=>({from:a,to:b,distance:10,floor:1,type:"corridor" as const})),
  { from:"D_G72",to:"Db_i1",distance:8,floor:1,type:"corridor" },
  { from:"Db_sl",to:"Db_i2",distance:8,floor:1,type:"corridor" },
  { from:"Db_lf",to:"Db_sl",distance:6,floor:1,type:"corridor" },
  { from:"D_G68",to:"Db_i4",distance:8,floor:1,type:"corridor" },

  // ═══ B BLOCK ═══
  ...[["Bb_en","Bb_c0"],["Bb_c0","Bb_i1"],["Bb_i1","Bb_c1"],["Bb_c1","Bb_i2"],
      ["Bb_i2","Bb_c2"],["Bb_c2","Bb_i3"],["Bb_i3","Bb_c3"],["Bb_c3","Bb_i4"],
      ["Bb_i4","Bb_c4"],["Bb_c4","Bb_ex"]].map(
    ([a,b])=>({from:a,to:b,distance:10,floor:1,type:"corridor" as const})),
  { from:"B_G60",to:"Bb_i1",distance:8,floor:1,type:"corridor" },
  { from:"B_G61",to:"Bb_c1",distance:8,floor:1,type:"corridor" },
  { from:"B_mr",to:"Bb_i2",distance:8,floor:1,type:"corridor" },
  { from:"Bb_sl",to:"Bb_i3",distance:8,floor:1,type:"corridor" },
  { from:"Bb_lf",to:"Bb_sl",distance:6,floor:1,type:"corridor" },
  { from:"B_G67",to:"Bb_i3",distance:8,floor:1,type:"corridor" },
  { from:"B_wr",to:"Bb_i4",distance:8,floor:1,type:"corridor" },
]