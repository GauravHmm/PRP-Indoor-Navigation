// ============================================================
// PRP Building — Navigation Graph
// - Rooms around hex perimeters
// - Stairs+Lift = single combined node per C-block hex
// - Water nodes on corridor paths BETWEEN hexes
// - More corridor nodes for smoother paths
// - B/D blocks: stairs on path, lift behind
// ============================================================

export interface NavNode {
  id: string; x: number; y: number; floor: number; block: string
  type: "room" | "corridor" | "intersection" | "stairs" | "elevator" | "entrance"
  name: string; description?: string; category?: string
}
export interface NavEdge {
  from: string; to: string; distance: number; floor: number
  type: "corridor" | "stairs" | "elevator"
}

// ═══ E BLOCK ═══
// Hex: (250,55)(320,95)(320,210)(250,250)(180,210)(180,95)

const E_NODES: NavNode[] = [
  { id: "E2", x: 183, y: 155, floor: 1, block: "E", type: "entrance", name: "E2 Entrance", description: "left" },
  { id: "E1", x: 317, y: 155, floor: 1, block: "E", type: "entrance", name: "E1 Entrance", description: "right" },
  { id: "E_it", x: 250, y: 72, floor: 1, block: "E", type: "intersection", name: "E" },
  { id: "E_ib", x: 250, y: 235, floor: 1, block: "E", type: "intersection", name: "E" },
  // Left wall corridor (follows hex left contour)
  { id: "E_lc1", x: 196, y: 100, floor: 1, block: "E", type: "corridor", name: "E" },
  { id: "E_lc2", x: 196, y: 128, floor: 1, block: "E", type: "corridor", name: "E" },
  { id: "E_lc3", x: 196, y: 155, floor: 1, block: "E", type: "corridor", name: "E" },
  { id: "E_lc4", x: 196, y: 182, floor: 1, block: "E", type: "corridor", name: "E" },
  { id: "E_lc5", x: 196, y: 208, floor: 1, block: "E", type: "corridor", name: "E" },
  // Right wall corridor
  { id: "E_rc1", x: 304, y: 100, floor: 1, block: "E", type: "corridor", name: "E" },
  { id: "E_rc2", x: 304, y: 128, floor: 1, block: "E", type: "corridor", name: "E" },
  { id: "E_rc3", x: 304, y: 155, floor: 1, block: "E", type: "corridor", name: "E" },
  { id: "E_rc4", x: 304, y: 182, floor: 1, block: "E", type: "corridor", name: "E" },
  { id: "E_rc5", x: 304, y: 208, floor: 1, block: "E", type: "corridor", name: "E" },
  // Horizontal mid-corridor (E2→E1 straight path, symmetric to A block)
  { id: "E_mc1", x: 220, y: 155, floor: 1, block: "E", type: "corridor", name: "E" },
  { id: "E_mc2", x: 250, y: 155, floor: 1, block: "E", type: "corridor", name: "E" },
  { id: "E_mc3", x: 280, y: 155, floor: 1, block: "E", type: "corridor", name: "E" },
  // Rooms/services around perimeter
  { id: "E_s1", x: 250, y: 62, floor: 1, block: "E", type: "stairs", name: "Stairs", description: "top" },
  { id: "E_lf1", x: 268, y: 75, floor: 1, block: "E", type: "elevator", name: "Lift", description: "upper, near G54" },
  { id: "E_G54", x: 184, y: 98, floor: 1, block: "E", type: "room", name: "G54" },
  { id: "E_G34", x: 184, y: 118, floor: 1, block: "E", type: "room", name: "G34" },
  { id: "E_G33", x: 184, y: 138, floor: 1, block: "E", type: "room", name: "G33" },
  { id: "E_G37", x: 316, y: 128, floor: 1, block: "E", type: "room", name: "G37" },
  { id: "E_G32", x: 184, y: 158, floor: 1, block: "E", type: "room", name: "G32" },
  { id: "E_sl2", x: 312, y: 132, floor: 1, block: "E", type: "elevator", name: "Lift", description: "right" },
  { id: "E_st2", x: 312, y: 122, floor: 1, block: "E", type: "stairs", name: "Stairs", description: "right, below lift" },
  { id: "E_sl3", x: 312, y: 182, floor: 1, block: "E", type: "stairs", name: "Stairs", description: "right, below E1" },
  { id: "E_lf3", x: 312, y: 192, floor: 1, block: "E", type: "elevator", name: "Lift", description: "right, below stairs" },
  { id: "E_G31", x: 184, y: 178, floor: 1, block: "E", type: "room", name: "G31" },
  { id: "E_G41", x: 316, y: 178, floor: 1, block: "E", type: "room", name: "G41" },
  { id: "E_G30", x: 184, y: 198, floor: 1, block: "E", type: "room", name: "G30" },
  { id: "E_G20", x: 316, y: 198, floor: 1, block: "E", type: "room", name: "G20" },
  // Sitting areas (center, dead-end)
  { id: "E_sit1", x: 245, y: 140, floor: 1, block: "E", type: "room", name: "Sitting Area", description: "upper, E block" },
  { id: "E_sit2", x: 255, y: 170, floor: 1, block: "E", type: "room", name: "Sitting Area", description: "lower, E block" },
]

// ═══ A BLOCK ═══
// Hex: (750,55)(820,95)(820,210)(750,250)(680,210)(680,95)
// LEFT (A1): G49,G48 above entrance; G45,G44 below; stairs/lift on both sides of A1
// RIGHT (A2): G51,G52 above entrance; G53,G54 below
// CENTER: two sitting areas. Straight path A1→A2.

const A_NODES: NavNode[] = [
  // Entrances
  { id: "A1", x: 683, y: 155, floor: 1, block: "A", type: "entrance", name: "A1 Entrance", description: "left entrance" },
  { id: "A2", x: 817, y: 155, floor: 1, block: "A", type: "entrance", name: "A2 Entrance", description: "right entrance" },
  // Top & bottom intersections
  { id: "A_it", x: 750, y: 72, floor: 1, block: "A", type: "intersection", name: "A" },
  { id: "A_ib", x: 750, y: 235, floor: 1, block: "A", type: "intersection", name: "A" },
  // Left wall corridor
  { id: "A_lc1", x: 696, y: 100, floor: 1, block: "A", type: "corridor", name: "A" },
  { id: "A_lc2", x: 696, y: 128, floor: 1, block: "A", type: "corridor", name: "A" },
  { id: "A_lc3", x: 696, y: 155, floor: 1, block: "A", type: "corridor", name: "A" },
  { id: "A_lc4", x: 696, y: 182, floor: 1, block: "A", type: "corridor", name: "A" },
  { id: "A_lc5", x: 696, y: 208, floor: 1, block: "A", type: "corridor", name: "A" },
  // Right wall corridor
  { id: "A_rc1", x: 804, y: 100, floor: 1, block: "A", type: "corridor", name: "A" },
  { id: "A_rc2", x: 804, y: 128, floor: 1, block: "A", type: "corridor", name: "A" },
  { id: "A_rc3", x: 804, y: 155, floor: 1, block: "A", type: "corridor", name: "A" },
  { id: "A_rc4", x: 804, y: 182, floor: 1, block: "A", type: "corridor", name: "A" },
  { id: "A_rc5", x: 804, y: 208, floor: 1, block: "A", type: "corridor", name: "A" },
  { id: "A_rc6", x: 804, y: 218, floor: 1, block: "A", type: "corridor", name: "A" },
  // Horizontal mid-corridor (A1→A2 straight path)
  { id: "A_mc1", x: 720, y: 155, floor: 1, block: "A", type: "corridor", name: "A" },
  { id: "A_mc2", x: 750, y: 155, floor: 1, block: "A", type: "corridor", name: "A" },
  { id: "A_mc3", x: 780, y: 155, floor: 1, block: "A", type: "corridor", name: "A" },
  // Services
  { id: "A_s1", x: 750, y: 62, floor: 1, block: "A", type: "stairs", name: "Stairs", description: "top of A block" },
  { id: "A_lf1", x: 732, y: 75, floor: 1, block: "A", type: "elevator", name: "Lift", description: "upper right, A block" },
  { id: "A_sl_ul", x: 684, y: 128, floor: 1, block: "A", type: "stairs", name: "Stairs", description: "upper left, A block" },
  { id: "A_sl_ll", x: 684, y: 188, floor: 1, block: "A", type: "stairs", name: "Stairs", description: "lower left, A block" },
  // LEFT side rooms (A1 side)
  { id: "A_G49", x: 684, y: 98, floor: 1, block: "A", type: "room", name: "G49", description: "A block" },
  { id: "A_G48", x: 684, y: 118, floor: 1, block: "A", type: "room", name: "G48", description: "A block" },
  { id: "A_G45", x: 684, y: 178, floor: 1, block: "A", type: "room", name: "G45", description: "A block" },
  { id: "A_G44", x: 684, y: 198, floor: 1, block: "A", type: "room", name: "G44", description: "A block" },
  // RIGHT side rooms (A2 side, top→bottom)
  { id: "A_G51", x: 816, y: 118, floor: 1, block: "A", type: "room", name: "G51", description: "Biosafety Level-II Lab" },
  { id: "A_G52", x: 816, y: 148, floor: 1, block: "A", type: "room", name: "G52", description: "Molecular Technology Lab" },
  { id: "A_G53", x: 816, y: 168, floor: 1, block: "A", type: "room", name: "G53", description: "Genomics & Bioinformatics Lab" },
  { id: "A_G54", x: 816, y: 188, floor: 1, block: "A", type: "room", name: "G54", description: "Phage Directory Lab" },
  // Sitting areas (center of hex, dead-end)
  { id: "A_sit1", x: 745, y: 140, floor: 1, block: "A", type: "room", name: "Sitting Area", description: "upper, A block" },
  { id: "A_sit2", x: 755, y: 165, floor: 1, block: "A", type: "room", name: "Sitting Area", description: "lower, A block" },
  // Bottom
  { id: "A_G43", x: 684, y: 215, floor: 1, block: "A", type: "room", name: "G43", description: "Men's Washroom" },
]

// ═══ C BLOCK ═══

const C_NODES: NavNode[] = [
  { id: "C_entE", x: 300, y: 244, floor: 1, block: "C", type: "entrance", name: "To E Block" },
  { id: "C_entA", x: 700, y: 244, floor: 1, block: "C", type: "entrance", name: "To A Block" },
  { id: "C1", x: 500, y: 608, floor: 1, block: "C", type: "entrance", name: "C1 Entrance", description: "main courtyard entrance" },
  { id: "C3", x: 365, y: 425, floor: 1, block: "C", type: "entrance", name: "C3 Entrance", description: "back entrance, L2-L1 corridor" },

  // ── L3 HEX (cx=300 cy=272 r=30, directly attached to E) ──
  { id: "L3t", x: 300, y: 248, floor: 1, block: "C", type: "intersection", name: "L3" },
  { id: "L3c", x: 300, y: 272, floor: 1, block: "C", type: "corridor", name: "L3" },
  { id: "L3b", x: 300, y: 296, floor: 1, block: "C", type: "intersection", name: "L3" },
  // Left wall: stairs, lift, then washrooms
  { id: "L3_st", x: 282, y: 260, floor: 1, block: "C", type: "stairs", name: "Stairs", description: "L3, E-C connector" },
  { id: "L3_lf", x: 284, y: 272, floor: 1, block: "C", type: "elevator", name: "Lift", description: "L3, E-C connector" },
  { id: "C_G28", x: 277, y: 265, floor: 1, block: "C", type: "room", name: "G28", description: "Women's Washroom" },
  { id: "C_G27", x: 277, y: 282, floor: 1, block: "C", type: "room", name: "G27", description: "Men's Washroom" },

  // Corridor L3→L2 (angled path: 300,298 → 360,340)
  { id: "cA", x: 315, y: 312, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cA2", x: 320, y: 316, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cB", x: 330, y: 322, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "L3L2_w", x: 338, y: 328, floor: 1, block: "C", type: "room", name: "Water", description: "drinking water, L3-L2" },
  { id: "cB2", x: 338, y: 332, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cC", x: 345, y: 332, floor: 1, block: "C", type: "corridor", name: "c" },

  // ── L2 HEX (rotated -45°, cx=360 cy=380 r=48) ──
  { id: "L2t", x: 360, y: 342, floor: 1, block: "C", type: "intersection", name: "L2" },
  { id: "L2b", x: 360, y: 420, floor: 1, block: "C", type: "intersection", name: "L2" },
  { id: "L2_lc1", x: 328, y: 362, floor: 1, block: "C", type: "corridor", name: "L2" },
  { id: "L2_lc2", x: 326, y: 382, floor: 1, block: "C", type: "corridor", name: "L2" },
  { id: "L2_lc3", x: 328, y: 402, floor: 1, block: "C", type: "corridor", name: "L2" },
  { id: "L2_rc1", x: 392, y: 358, floor: 1, block: "C", type: "corridor", name: "L2" },
  { id: "L2_rc2", x: 394, y: 380, floor: 1, block: "C", type: "corridor", name: "L2" },
  { id: "L2_rc3", x: 392, y: 402, floor: 1, block: "C", type: "corridor", name: "L2" },
  { id: "C_G23", x: 322, y: 358, floor: 1, block: "C", type: "room", name: "G23", description: "Electrical Room" },
  { id: "C_G26", x: 398, y: 358, floor: 1, block: "C", type: "room", name: "G26" },
  { id: "C_G25", x: 398, y: 400, floor: 1, block: "C", type: "room", name: "G25" },
  // No stairs/lift in L2

  // Corridor L2→L1 (angled path: 360,420 → 420,428, C3/G22 on left, water on right)
  { id: "cD", x: 375, y: 430, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cD2", x: 382, y: 436, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cE", x: 390, y: 440, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "L2L1_w", x: 400, y: 448, floor: 1, block: "C", type: "room", name: "Water", description: "drinking water, L2-L1" },
  { id: "cE2", x: 402, y: 446, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cF", x: 405, y: 450, floor: 1, block: "C", type: "corridor", name: "c" },

  // ── L1 HEX (cx=420 cy=468 r=55) ──
  { id: "L1t", x: 420, y: 458, floor: 1, block: "C", type: "intersection", name: "L1" },
  { id: "L1b", x: 420, y: 558, floor: 1, block: "C", type: "intersection", name: "L1" },
  { id: "L1_lc1", x: 380, y: 485, floor: 1, block: "C", type: "corridor", name: "L1" },
  { id: "L1_lc2", x: 378, y: 508, floor: 1, block: "C", type: "corridor", name: "L1" },
  { id: "L1_lc3", x: 380, y: 532, floor: 1, block: "C", type: "corridor", name: "L1" },
  { id: "L1_rc1", x: 460, y: 485, floor: 1, block: "C", type: "corridor", name: "L1" },
  { id: "L1_rc2", x: 462, y: 508, floor: 1, block: "C", type: "corridor", name: "L1" },
  { id: "L1_rc3", x: 460, y: 532, floor: 1, block: "C", type: "corridor", name: "L1" },
  { id: "C_G21", x: 375, y: 492, floor: 1, block: "C", type: "room", name: "G21" },
  { id: "C_G22", x: 377, y: 433, floor: 1, block: "C", type: "room", name: "G22", description: "Canteen" },
  { id: "C_G20", x: 380, y: 532, floor: 1, block: "C", type: "room", name: "G20", description: "Faculty Cabins" },
  // No stairs/lift in L1
  { id: "C_G17", x: 465, y: 490, floor: 1, block: "C", type: "room", name: "G17", description: "Engineering Physics Lab" },
  { id: "C_G18", x: 465, y: 522, floor: 1, block: "C", type: "room", name: "G18", description: "Physics Research Lab" },

  // Corridor L1→Gem (angled path: 420,512 → 445,530)
  { id: "cG", x: 425, y: 572, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cG2", x: 428, y: 578, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cH", x: 432, y: 586, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cH2", x: 436, y: 594, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cI", x: 438, y: 600, floor: 1, block: "C", type: "corridor", name: "c" },

  // ── GEM (rooms on back edges, stairs/lift on both sides, D/B connectors symmetrical) ──
  { id: "Dt", x: 500, y: 612, floor: 1, block: "C", type: "intersection", name: "Gem" },
  { id: "Dc1", x: 500, y: 625, floor: 1, block: "C", type: "corridor", name: "Gem" },
  { id: "Dm", x: 500, y: 640, floor: 1, block: "C", type: "intersection", name: "Gem" },
  { id: "Dc2", x: 500, y: 660, floor: 1, block: "C", type: "corridor", name: "Gem" },
  { id: "Dl", x: 445, y: 628, floor: 1, block: "C", type: "intersection", name: "Gem L" },
  { id: "Dr", x: 555, y: 628, floor: 1, block: "C", type: "intersection", name: "Gem R" },
  // Back left edge: stat → G16 → G15 (all inside gem polygon)
  { id: "C_stat", x: 442, y: 632, floor: 1, block: "C", type: "room", name: "Stationary", description: "Stationary shop" },
  { id: "C_G16", x: 455, y: 658, floor: 1, block: "C", type: "room", name: "G16", description: "Centre for Clean Environment" },
  { id: "C_G15", x: 475, y: 670, floor: 1, block: "C", type: "room", name: "G15", description: "Centre for Clean Environment" },
  // Back right edge: G14
  { id: "C_G14", x: 558, y: 632, floor: 1, block: "C", type: "room", name: "G14", description: "SCOPE School Office" },
  // Stairs + Lift on both sides (separated)
  { id: "Gem_st_l", x: 438, y: 642, floor: 1, block: "C", type: "stairs", name: "Stairs", description: "gem left, to D block" },
  { id: "Gem_lf_l", x: 440, y: 652, floor: 1, block: "C", type: "elevator", name: "Lift", description: "gem left, to D block" },
  { id: "Gem_st_r", x: 562, y: 642, floor: 1, block: "C", type: "stairs", name: "Stairs", description: "gem right, to B block" },
  { id: "Gem_lf_r", x: 560, y: 652, floor: 1, block: "C", type: "elevator", name: "Lift", description: "gem right, to B block" },

  // Corridor Gem→R1 (angled path: 555,530 → 580,512, mirror of L1→Gem)
  { id: "cJ", x: 562, y: 600, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cJ2", x: 566, y: 594, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cK", x: 568, y: 586, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cK2", x: 574, y: 578, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cL", x: 575, y: 572, floor: 1, block: "C", type: "corridor", name: "c" },

  // ── R1 HEX (cx=580 cy=468 r=55) ──
  { id: "R1t", x: 580, y: 458, floor: 1, block: "C", type: "intersection", name: "R1" },
  { id: "R1b", x: 580, y: 558, floor: 1, block: "C", type: "intersection", name: "R1" },
  { id: "R1_lc1", x: 540, y: 485, floor: 1, block: "C", type: "corridor", name: "R1" },
  { id: "R1_lc2", x: 538, y: 508, floor: 1, block: "C", type: "corridor", name: "R1" },
  { id: "R1_lc3", x: 540, y: 532, floor: 1, block: "C", type: "corridor", name: "R1" },
  { id: "R1_rc1", x: 620, y: 485, floor: 1, block: "C", type: "corridor", name: "R1" },
  { id: "R1_rc2", x: 622, y: 508, floor: 1, block: "C", type: "corridor", name: "R1" },
  { id: "R1_rc3", x: 620, y: 532, floor: 1, block: "C", type: "corridor", name: "R1" },
  { id: "R1_G07", x: 535, y: 490, floor: 1, block: "C", type: "room", name: "G07", description: "Chemistry Lab" },
  { id: "R1_G08", x: 535, y: 525, floor: 1, block: "C", type: "room", name: "G08" },
  // Stairs + Lift separated (R1 only hex with these on right arm)
  { id: "R1_st", x: 537, y: 540, floor: 1, block: "C", type: "stairs", name: "Stairs", description: "R1 left" },
  { id: "R1_lf", x: 539, y: 548, floor: 1, block: "C", type: "elevator", name: "Lift", description: "R1 left" },
  { id: "R1_G10", x: 625, y: 490, floor: 1, block: "C", type: "room", name: "G10" },
  { id: "R1_G11", x: 625, y: 525, floor: 1, block: "C", type: "room", name: "G11" },

  // Corridor R1→R2 (angled path: 580,420 → 640,428, mirror of L2→L1)
  { id: "cM", x: 595, y: 449, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cM2", x: 600, y: 446, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cN", x: 610, y: 440, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "R1R2_w", x: 618, y: 435, floor: 1, block: "C", type: "room", name: "Water", description: "drinking water, R1-R2" },
  { id: "C_G09", x: 605, y: 445, floor: 1, block: "C", type: "room", name: "G09", description: "Canteen" },
  { id: "cN2", x: 622, y: 436, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cO", x: 625, y: 430, floor: 1, block: "C", type: "corridor", name: "c" },
  // No stairs/lift in R2

  // ── R2 HEX (rotated 45° CW, cx=640 cy=380 r=48) ──
  { id: "R2t", x: 640, y: 342, floor: 1, block: "C", type: "intersection", name: "R2" },
  { id: "R2b", x: 640, y: 420, floor: 1, block: "C", type: "intersection", name: "R2" },
  { id: "R2_lc1", x: 608, y: 362, floor: 1, block: "C", type: "corridor", name: "R2" },
  { id: "R2_lc2", x: 606, y: 382, floor: 1, block: "C", type: "corridor", name: "R2" },
  { id: "R2_lc3", x: 608, y: 402, floor: 1, block: "C", type: "corridor", name: "R2" },
  { id: "R2_rc1", x: 672, y: 358, floor: 1, block: "C", type: "corridor", name: "R2" },
  { id: "R2_rc2", x: 674, y: 380, floor: 1, block: "C", type: "corridor", name: "R2" },
  { id: "R2_rc3", x: 672, y: 402, floor: 1, block: "C", type: "corridor", name: "R2" },
  { id: "R2_G03", x: 602, y: 358, floor: 1, block: "C", type: "room", name: "G03" },
  { id: "R2_G04", x: 602, y: 400, floor: 1, block: "C", type: "room", name: "G04" },
  { id: "R2_G05", x: 678, y: 358, floor: 1, block: "C", type: "room", name: "G05", description: "Electrical Room" },
  { id: "R2_G06", x: 678, y: 400, floor: 1, block: "C", type: "room", name: "G06" },

  // Corridor R2→R3 (angled path: 640,340 → 700,298, mirror of L3→L2)
  { id: "cP", x: 655, y: 332, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cP2", x: 660, y: 326, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cQ", x: 670, y: 322, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "R2R3_w", x: 662, y: 328, floor: 1, block: "C", type: "room", name: "Water", description: "drinking water, R2-R3" },
  { id: "cQ2", x: 682, y: 310, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "cR", x: 685, y: 312, floor: 1, block: "C", type: "corridor", name: "c" },

  // ── R3 HEX (cx=700 cy=272 r=30, directly attached to A) ──
  { id: "R3t", x: 700, y: 248, floor: 1, block: "C", type: "intersection", name: "R3" },
  { id: "R3c", x: 700, y: 272, floor: 1, block: "C", type: "corridor", name: "R3" },
  { id: "R3b", x: 700, y: 296, floor: 1, block: "C", type: "intersection", name: "R3" },
  { id: "R3_G01", x: 723, y: 265, floor: 1, block: "C", type: "room", name: "G01", description: "Women's Washroom" },
  { id: "R3_G02", x: 723, y: 282, floor: 1, block: "C", type: "room", name: "G02", description: "Men's Washroom" },
  { id: "R3_st", x: 718, y: 260, floor: 1, block: "C", type: "stairs", name: "Stairs", description: "below G02, A-C connector" },
  { id: "R3_lf", x: 716, y: 272, floor: 1, block: "C", type: "elevator", name: "Lift", description: "below G02, A-C connector" },

  // ── Connector corridor nodes (inter-block paths) ──
  // E↔C connector corridor
  { id: "conn_EC_1", x: 268, y: 240, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "conn_EC_2", x: 284, y: 246, floor: 1, block: "C", type: "corridor", name: "c" },
  // A↔C connector corridor
  { id: "conn_AC_1", x: 732, y: 240, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "conn_AC_2", x: 716, y: 246, floor: 1, block: "C", type: "corridor", name: "c" },
  // C→D connector (gem left → D block)
  { id: "conn_CD_1", x: 425, y: 665, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "conn_CD_2", x: 400, y: 695, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "conn_CD_3", x: 370, y: 720, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "conn_CD_4", x: 350, y: 736, floor: 1, block: "C", type: "corridor", name: "c" },
  // C→B connector (gem right → B block)
  { id: "conn_CB_1", x: 575, y: 665, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "conn_CB_2", x: 600, y: 695, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "conn_CB_3", x: 630, y: 720, floor: 1, block: "C", type: "corridor", name: "c" },
  { id: "conn_CB_4", x: 650, y: 736, floor: 1, block: "C", type: "corridor", name: "c" },
  // Gem bottom intersection
  { id: "Gem_b", x: 500, y: 675, floor: 1, block: "C", type: "intersection", name: "Gem" },
]



// ═══ D BLOCK ═══
const D_NODES: NavNode[] = [
  // Rotated 45°: TOP=(340,636) RIGHT=(404,700) BOTTOM=(340,764) LEFT=(276,700)
  // No external entrance for D block (unlike B)
  { id: "Db_en", x: 340, y: 738, floor: 1, block: "D", type: "entrance", name: "D from C" },
  { id: "Db_i1", x: 340, y: 768, floor: 1, block: "D", type: "intersection", name: "D" },
  { id: "Db_i2", x: 340, y: 800, floor: 1, block: "D", type: "intersection", name: "D" },
  // Rooms
  { id: "D_G72", x: 300, y: 758, floor: 1, block: "D", type: "room", name: "G72", description: "Canteen" },
  { id: "Db_sl", x: 340, y: 782, floor: 1, block: "D", type: "stairs", name: "Stairs", description: "center" },
  { id: "Db_lf", x: 310, y: 790, floor: 1, block: "D", type: "elevator", name: "Lift", description: "left side" },
  { id: "D_G68", x: 330, y: 808, floor: 1, block: "D", type: "room", name: "G68" },
]


// ═══ B BLOCK ═══
const B_NODES: NavNode[] = [
  // Rotated -45°: TOP=(660,636) RIGHT=(724,700) BOTTOM=(660,764) LEFT=(596,700)
  { id: "Bb_en", x: 660, y: 738, floor: 1, block: "B", type: "entrance", name: "B from C" },
  { id: "Bb_ex", x: 660, y: 822, floor: 1, block: "B", type: "entrance", name: "B External", description: "B block external entrance" },
  { id: "Bb_i1", x: 660, y: 768, floor: 1, block: "B", type: "intersection", name: "B" },
  { id: "Bb_i2", x: 660, y: 800, floor: 1, block: "B", type: "intersection", name: "B" },
  // Rooms — near top-right edge per sketch
  { id: "B_G60", x: 690, y: 748, floor: 1, block: "B", type: "room", name: "G60", description: "Exam Hall / Faculty Cabins" },
  { id: "B_G61", x: 700, y: 755, floor: 1, block: "B", type: "room", name: "G61" },
  { id: "B_mr", x: 700, y: 778, floor: 1, block: "B", type: "room", name: "Men's WR", description: "Men's Washroom" },
  { id: "Bb_sl", x: 660, y: 782, floor: 1, block: "B", type: "stairs", name: "Stairs", description: "center" },
  { id: "Bb_lf", x: 690, y: 790, floor: 1, block: "B", type: "elevator", name: "Lift", description: "back middle edge" },
  { id: "B_G67", x: 620, y: 790, floor: 1, block: "B", type: "room", name: "G67", description: "Office" },
  { id: "B_wr", x: 660, y: 815, floor: 1, block: "B", type: "room", name: "Women's WR", description: "Women's Washroom" },
]

// ── Category auto-assignment ─────────────────────────────────
function assignCategory(node: NavNode): string {
  if (node.type === "elevator") return "lift"
  if (node.type === "stairs") return "stairs"
  if (node.name === "Water") return "water"
  // Washrooms — check name and description
  if (node.name === "Washroom" && node.description?.toLowerCase().includes("women")) return "washroom_female"
  if (node.name === "Washroom" && node.description?.toLowerCase().includes("men")) return "washroom_male"
  if (node.name === "Men's WR" || node.description?.toLowerCase().includes("men's washroom")) return "washroom_male"
  if (node.name === "Women's WR" || node.description?.toLowerCase().includes("women's washroom")) return "washroom_female"
  if (node.name === "Sitting Area") return "sitting"
  if (node.name === "Stationary") return "stationary"
  // Canteen
  if (node.description?.toLowerCase().includes("canteen")) return "canteen"
  // Office / Faculty
  if (node.description?.toLowerCase().includes("office") || node.description?.toLowerCase().includes("faculty") || node.description?.toLowerCase().includes("cabin")) return "office"
  // Electrical
  if (node.description?.toLowerCase().includes("electrical")) return "electrical"
  // Lab
  if (node.description?.toLowerCase().includes("lab")) return "lab"
  if (node.type === "entrance") return "entrance"
  if (node.type === "corridor" || node.type === "intersection") return "corridor"
  return "room"
}

// ═══ COURTYARD + BACK ENTRANCE ═══
const EXTRA_NODES: NavNode[] = [
  { id: "Courtyard", x: 500, y: 80, floor: 1, block: "C", type: "entrance", name: "Courtyard Entrance", description: "Main courtyard entrance" },
  { id: "court_cross", x: 500, y: 152, floor: 1, block: "C", type: "intersection", name: "Courtyard Crossing" },
  { id: "court_toE", x: 400, y: 152, floor: 1, block: "C", type: "corridor", name: "Courtyard Path" },
  { id: "court_toA", x: 600, y: 152, floor: 1, block: "C", type: "corridor", name: "Courtyard Path" },
  { id: "court_path1", x: 500, y: 300, floor: 1, block: "C", type: "corridor", name: "Courtyard Path" },
  { id: "court_path2", x: 500, y: 430, floor: 1, block: "C", type: "corridor", name: "Courtyard Path" },
  { id: "PRP_back", x: 380, y: 580, floor: 1, block: "C", type: "entrance", name: "PRP Back Entrance", description: "Back entrance of PRP building" },
]

// ═══ FLOOR LABELS ═══
export const FLOOR_LABELS: Record<number, string> = { 1: "Ground", 2: "1st Floor", 3: "2nd Floor" }

// ═══ FLOOR CLONING ═══
const _ground: NavNode[] = [...E_NODES, ...A_NODES, ...C_NODES, ...D_NODES, ...B_NODES, ...EXTRA_NODES]

// Nodes that only exist on Ground Floor (external entrances, courtyard paths)
const GROUND_ONLY_IDS = new Set([
  "E1", "E2", "A1", "A2", "C1", "C3", "Bb_ex",
  "C_entE", "C_entA",
  "Courtyard", "court_cross", "court_toE", "court_toA", "court_path1", "court_path2",
  "PRP_back",
])
const _cloneable = _ground.filter(n => !GROUND_ONLY_IDS.has(n.id))

// Clone nodes for another floor (same positions, different IDs/names)
function cloneFloor(nodes: NavNode[], floor: number, prefix: string,
  nameMap: Record<string, {n:string,d?:string,c?:string}>): NavNode[] {
  return nodes.map(nd => {
    const m = nameMap[nd.id]
    return { ...nd, id: prefix+nd.id, floor,
      name: m?.n ?? nd.name, description: m?.d ?? nd.description,
      category: m?.c ?? nd.category }
  })
}

// Floor 1 room name mapping (only rooms that change name)
const F1_NAMES: Record<string,{n:string,d?:string,c?:string}> = {
  // E block
  E_G54:{n:"132"}, E_G34:{n:"133",d:"Washroom"}, E_G33:{n:"134",d:"Classroom"},
  E_G32:{n:"135"}, E_G31:{n:"136"}, E_G30:{n:"137"},
  E_G37:{n:"140",d:"Men's Staff Washroom"}, E_G41:{n:"138",d:"Lab",c:"lab"},
  E_G20:{n:"139",d:"Women's Staff Washroom",c:"washroom_female"},
  // A block
  A_G49:{n:"151"}, A_G48:{n:"150"},
  A_G45:{n:"147"}, A_G44:{n:"146",d:"SHINE Office",c:"office"},
  A_G51:{n:"157"}, A_G52:{n:"156"}, A_G53:{n:"155"}, A_G43:{n:"153"},
  // C block L3
  C_G28:{n:"131",d:"Women's Washroom",c:"washroom_female"},
  C_G27:{n:"130",d:"Men's Washroom",c:"washroom_male"},
  // C block L2
  C_G23:{n:"127"}, C_G24:{n:"128"}, C_G26:{n:"126"}, C_G25:{n:"125"},
  // C block L1
  C_G21:{n:"119",d:"Mathematics Computing Lab II",c:"lab"}, C_G20_C:{n:"120"},
  C_G17:{n:"121",d:"Faculty Cabins",c:"office"}, C_G18:{n:"122"},
  C_G22_L1:{n:"124"}, C3:{n:"C3"},
  C_G22:{n:"123"},
  // C block Gem
  C_stat:{n:"Stationary"}, C_G16:{n:"116"}, C_G15:{n:"115"}, C_G14:{n:"114"},
  // C block R1
  R1_G07:{n:"113",d:"Staff Rest Room",c:"office"}, R1_G08:{n:"108",d:"IoT Lab",c:"lab"},
  R1_G10:{n:"112"}, R1_G11:{n:"110"},
  // C block R2
  R2_G03:{n:"108"}, R2_G04:{n:"104"}, R2_G05:{n:"107"}, R2_G06:{n:"103"},
  // C block R3
  R3_G01:{n:"102",d:"Men's Washroom",c:"washroom_male"},
  R3_G02:{n:"101",d:"Women's Washroom",c:"washroom_female"},
  // D block
  D_G72:{n:"D-101"}, D_G68:{n:"D-102"},
  // B block
  B_G60:{n:"B-101",d:"Faculty Cabins"}, B_G61:{n:"B-102"}, B_G67:{n:"B-103"},
}

// Floor 2 room name mapping (sample/generic names)
const F2_NAMES: Record<string,{n:string,d?:string,c?:string}> = {
  E_G54:{n:"201"}, E_G34:{n:"202"}, E_G33:{n:"203"}, E_G32:{n:"204"},
  E_G31:{n:"205"}, E_G30:{n:"206"}, E_G37:{n:"207"}, E_G41:{n:"208",d:"Advanced Lab 1",c:"lab"},
  E_G20:{n:"209"}, A_G49:{n:"251"}, A_G48:{n:"252"}, A_G45:{n:"253"},
  A_G44:{n:"254",d:"Office 201",c:"office"}, A_G51:{n:"255"}, A_G52:{n:"256"},
  A_G53:{n:"257"}, A_G43:{n:"258"},
  C_G28:{n:"231",d:"Washroom",c:"washroom_female"}, C_G27:{n:"232",d:"Washroom",c:"washroom_male"},
  C_G23:{n:"221"}, C_G24:{n:"222"}, C_G26:{n:"223"}, C_G25:{n:"224"},
  C_G21:{n:"211",d:"Advanced Lab 2",c:"lab"}, C_G20_C:{n:"212"}, C_G17:{n:"213"},
  C_G18:{n:"214"}, C_G22_L1:{n:"215"}, C_G22:{n:"216"},
  C_stat:{n:"Stationary"}, C_G16:{n:"217"}, C_G15:{n:"218"}, C_G14:{n:"219"},
  R1_G07:{n:"241"}, R1_G08:{n:"242"}, R1_G10:{n:"243"}, R1_G11:{n:"244"},
  R2_G03:{n:"245"}, R2_G04:{n:"246"}, R2_G05:{n:"247"}, R2_G06:{n:"248"},
  R3_G01:{n:"249",d:"Washroom",c:"washroom_male"}, R3_G02:{n:"250",d:"Washroom",c:"washroom_female"},
  D_G72:{n:"D-201"}, D_G68:{n:"D-202"},
  B_G60:{n:"B-201"}, B_G61:{n:"B-202"}, B_G67:{n:"B-203"},
}

const F1_NODES = cloneFloor(_cloneable, 2, "F1_", F1_NAMES)
const F2_NODES = cloneFloor(_cloneable, 3, "F2_", F2_NAMES)

const _rawNodes: NavNode[] = [..._ground, ...F1_NODES, ...F2_NODES]
export const navNodes: NavNode[] = _rawNodes.map(n => ({ ...n, category: n.category ?? assignCategory(n) }))


// ── EDGES ──
const _groundEdges: NavEdge[] = [
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
  // Horizontal mid-corridor (E2→E1)
  { from:"E_lc3",to:"E_mc1",distance:25,floor:1,type:"corridor" },
  { from:"E_mc1",to:"E_mc2",distance:30,floor:1,type:"corridor" },
  { from:"E_mc2",to:"E_mc3",distance:30,floor:1,type:"corridor" },
  { from:"E_mc3",to:"E_rc3",distance:25,floor:1,type:"corridor" },
  { from:"E1",to:"E_rc3",distance:8,floor:1,type:"corridor" },
  { from:"E2",to:"E_lc3",distance:8,floor:1,type:"corridor" },
  { from:"E_s1",to:"E_it",distance:8,floor:1,type:"corridor" },
  { from:"E_G54",to:"E_lc1",distance:10,floor:1,type:"corridor" },
  { from:"E_G34",to:"E_lc2",distance:8,floor:1,type:"corridor" },
  { from:"E_G33",to:"E_lc2",distance:8,floor:1,type:"corridor" },
  { from:"E_sl2",to:"E_rc2",distance:8,floor:1,type:"corridor" },
  { from:"E_G37",to:"E_rc2",distance:8,floor:1,type:"corridor" },
  { from:"E_G32",to:"E_lc3",distance:8,floor:1,type:"corridor" },
  { from:"E_sl3",to:"E_rc4",distance:8,floor:1,type:"corridor" },
  { from:"E_lf3",to:"E_rc4",distance:8,floor:1,type:"corridor" },
  { from:"E_G31",to:"E_lc4",distance:8,floor:1,type:"corridor" },
  { from:"E_G41",to:"E_rc4",distance:8,floor:1,type:"corridor" },
  { from:"E_G30",to:"E_lc5",distance:8,floor:1,type:"corridor" },
  { from:"E_G20",to:"E_rc5",distance:8,floor:1,type:"corridor" },
  // New split services
  { from:"E_lf1",to:"E_it",distance:10,floor:1,type:"corridor" },
  { from:"E_st2",to:"E_rc2",distance:8,floor:1,type:"corridor" },
  // Sitting areas (DEAD-END)
  { from:"E_sit1",to:"E_mc2",distance:15,floor:1,type:"corridor" },
  { from:"E_sit2",to:"E_mc2",distance:15,floor:1,type:"corridor" },

  // ═══ A BLOCK ═══
  // Left wall corridor spine (parallel to left hex edge)
  { from:"A_it",to:"A_lc1",distance:16,floor:1,type:"corridor" },
  ...[["A_lc1","A_lc2"],["A_lc2","A_lc3"],["A_lc3","A_lc4"],["A_lc4","A_lc5"]].map(
    ([a,b])=>({from:a,to:b,distance:28,floor:1,type:"corridor" as const})),
  { from:"A_lc5",to:"A_ib",distance:20,floor:1,type:"corridor" },
  // Right wall corridor spine (parallel to right hex edge)
  { from:"A_it",to:"A_rc1",distance:16,floor:1,type:"corridor" },
  ...[["A_rc1","A_rc2"],["A_rc2","A_rc3"],["A_rc3","A_rc4"],["A_rc4","A_rc5"],["A_rc5","A_rc6"]].map(
    ([a,b])=>({from:a,to:b,distance:22,floor:1,type:"corridor" as const})),
  { from:"A_rc6",to:"A_ib",distance:20,floor:1,type:"corridor" },
  // Horizontal straight path A1→A2 (cuts hex in half at y=152)
  { from:"A_lc3",to:"A_mc1",distance:30,floor:1,type:"corridor" },
  { from:"A_mc1",to:"A_mc2",distance:30,floor:1,type:"corridor" },
  { from:"A_mc2",to:"A_mc3",distance:30,floor:1,type:"corridor" },
  { from:"A_mc3",to:"A_rc3",distance:30,floor:1,type:"corridor" },
  // Top cross connection
  { from:"A_lc1",to:"A_rc1",distance:100,floor:1,type:"corridor" },
  // Entrances & top stairs
  { from:"A_s1",to:"A_it",distance:8,floor:1,type:"corridor" },
  { from:"A_lf1",to:"A_it",distance:10,floor:1,type:"corridor" },
  { from:"A1",to:"A_lc3",distance:8,floor:1,type:"corridor" },
  { from:"A2",to:"A_rc3",distance:8,floor:1,type:"corridor" },
  // Left side rooms (A1 side)
  { from:"A_G49",to:"A_lc1",distance:8,floor:1,type:"corridor" },
  { from:"A_G48",to:"A_lc1",distance:8,floor:1,type:"corridor" },
  { from:"A_sl_ul",to:"A_lc2",distance:8,floor:1,type:"corridor" },
  { from:"A_G45",to:"A_lc4",distance:8,floor:1,type:"corridor" },
  { from:"A_G44",to:"A_lc5",distance:8,floor:1,type:"corridor" },
  { from:"A_sl_ll",to:"A_lc4",distance:8,floor:1,type:"corridor" },
  // Right side rooms (A2 side, top→bottom)
  { from:"A_G51",to:"A_rc2",distance:8,floor:1,type:"corridor" },
  { from:"A_G52",to:"A_rc3",distance:8,floor:1,type:"corridor" },
  { from:"A_G53",to:"A_rc4",distance:8,floor:1,type:"corridor" },
  { from:"A_G54",to:"A_rc4",distance:8,floor:1,type:"corridor" },
  // Sitting areas (DEAD-END)
  { from:"A_sit1",to:"A_mc2",distance:15,floor:1,type:"corridor" },
  { from:"A_sit2",to:"A_mc2",distance:15,floor:1,type:"corridor" },
  // Bottom
  { from:"A_G43",to:"A_ib",distance:8,floor:1,type:"corridor" },

  // ═══ C BLOCK ═══
  // L3
  { from:"C_entE",to:"L3t",distance:6,floor:1,type:"corridor" },
  { from:"L3t",to:"L3c",distance:28,floor:1,type:"corridor" },
  { from:"L3c",to:"L3b",distance:28,floor:1,type:"corridor" },
  { from:"C_G28",to:"L3c",distance:8,floor:1,type:"corridor" },
  { from:"C_G27",to:"L3c",distance:8,floor:1,type:"corridor" },
  { from:"L3_st",to:"L3c",distance:8,floor:1,type:"corridor" },
  { from:"L3_lf",to:"L3c",distance:8,floor:1,type:"corridor" },
  // L3→L2 (smooth)
  ...[["L3b","cA"],["cA","cA2"],["cA2","cB"],["cB","cB2"],["cB2","cC"],["cC","L2t"]].map(
    ([a,b])=>({from:a,to:b,distance:8,floor:1,type:"corridor" as const})),
  { from:"L3L2_w",to:"cB",distance:6,floor:1,type:"corridor" },
  // L2
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

  { from:"C_G26",to:"L2_rc1",distance:8,floor:1,type:"corridor" },
  { from:"C_G25",to:"L2_rc2",distance:8,floor:1,type:"corridor" },
  // L2→L1 (smooth)
  ...[["L2b","cD"],["cD","cD2"],["cD2","cE"],["cE","cE2"],["cE2","cF"],["cF","L1t"]].map(
    ([a,b])=>({from:a,to:b,distance:8,floor:1,type:"corridor" as const})),
  { from:"L2L1_w",to:"cE",distance:6,floor:1,type:"corridor" },
  // L1
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
  // Corridor rooms: C3 and G22 on left side of corridor, water on right
  { from:"C3",to:"cD",distance:12,floor:1,type:"corridor" },
  { from:"C_G22",to:"cD2",distance:10,floor:1,type:"corridor" },
  // L1 rooms
  { from:"C_G21",to:"L1_lc2",distance:8,floor:1,type:"corridor" },
  { from:"C_G20",to:"L1_lc3",distance:8,floor:1,type:"corridor" },
  { from:"C_G17",to:"L1_lc1",distance:8,floor:1,type:"corridor" },
  { from:"C_G18",to:"L1_lc2",distance:8,floor:1,type:"corridor" },
  // L1→Gem (smooth)
  ...[["L1b","cG"],["cG","cG2"],["cG2","cH"],["cH","cH2"],["cH2","cI"],["cI","Dl"]].map(
    ([a,b])=>({from:a,to:b,distance:6,floor:1,type:"corridor" as const})),
  // Gem (rooms on back edges, stairs/lift on both sides)
  { from:"C1",to:"Dt",distance:4,floor:1,type:"corridor" },
  { from:"Dt",to:"Dc1",distance:15,floor:1,type:"corridor" },
  { from:"Dc1",to:"Dm",distance:13,floor:1,type:"corridor" },
  { from:"Dm",to:"Dc2",distance:17,floor:1,type:"corridor" },
  { from:"Dc2",to:"Gem_b",distance:20,floor:1,type:"corridor" },
  { from:"Dl",to:"Dm",distance:18,floor:1,type:"corridor" },
  { from:"Dr",to:"Dm",distance:18,floor:1,type:"corridor" },
  { from:"Dt",to:"Dl",distance:22,floor:1,type:"corridor" },
  { from:"Dt",to:"Dr",distance:22,floor:1,type:"corridor" },
  // Back left edge rooms
  { from:"C_stat",to:"Dl",distance:8,floor:1,type:"corridor" },
  { from:"C_G16",to:"Dl",distance:10,floor:1,type:"corridor" },
  { from:"C_G15",to:"Dc2",distance:8,floor:1,type:"corridor" },
  // Back right edge rooms
  { from:"C_G14",to:"Dr",distance:8,floor:1,type:"corridor" },
  // Stairs + lift on both sides (separated)
  { from:"Gem_st_l",to:"Dc2",distance:8,floor:1,type:"corridor" },
  { from:"Gem_lf_l",to:"Dc2",distance:8,floor:1,type:"corridor" },
  { from:"Gem_st_r",to:"Dc2",distance:8,floor:1,type:"corridor" },
  { from:"Gem_lf_r",to:"Dc2",distance:8,floor:1,type:"corridor" },
  // Gem→R1 (smooth)
  ...[["Dr","cJ"],["cJ","cJ2"],["cJ2","cK"],["cK","cK2"],["cK2","cL"],["cL","R1b"]].map(
    ([a,b])=>({from:a,to:b,distance:6,floor:1,type:"corridor" as const})),
  // R1
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
  { from:"R1_G07",to:"R1_lc1",distance:8,floor:1,type:"corridor" },
  { from:"R1_G08",to:"R1_lc3",distance:8,floor:1,type:"corridor" },
  { from:"R1_G10",to:"R1_rc1",distance:8,floor:1,type:"corridor" },
  { from:"R1_G11",to:"R1_rc3",distance:8,floor:1,type:"corridor" },
  { from:"R1_st",to:"R1_lc3",distance:8,floor:1,type:"corridor" },
  { from:"R1_lf",to:"R1_lc3",distance:8,floor:1,type:"corridor" },
  // R1→R2 (smooth)
  ...[["R1t","cM"],["cM","cM2"],["cM2","cN"],["cN","cN2"],["cN2","cO"],["cO","R2b"]].map(
    ([a,b])=>({from:a,to:b,distance:8,floor:1,type:"corridor" as const})),
  { from:"R1R2_w",to:"cN",distance:6,floor:1,type:"corridor" },
  { from:"C_G09",to:"cN2",distance:10,floor:1,type:"corridor" },
  // R2
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
  { from:"R2_G03",to:"R2_lc1",distance:8,floor:1,type:"corridor" },
  { from:"R2_G04",to:"R2_lc3",distance:8,floor:1,type:"corridor" },
  { from:"R2_G05",to:"R2_rc1",distance:8,floor:1,type:"corridor" },
  { from:"R2_G06",to:"R2_rc3",distance:8,floor:1,type:"corridor" },
  // No stairs/lift in R2
  // R2→R3 (smooth)
  ...[["R2t","cP"],["cP","cP2"],["cP2","cQ"],["cQ","cQ2"],["cQ2","cR"],["cR","R3b"]].map(
    ([a,b])=>({from:a,to:b,distance:8,floor:1,type:"corridor" as const})),
  { from:"R2R3_w",to:"cQ",distance:6,floor:1,type:"corridor" },
  // R3
  { from:"R3t",to:"R3c",distance:28,floor:1,type:"corridor" },
  { from:"R3c",to:"R3b",distance:28,floor:1,type:"corridor" },
  { from:"C_entA",to:"R3t",distance:6,floor:1,type:"corridor" },
  { from:"R3_G01",to:"R3c",distance:8,floor:1,type:"corridor" },
  { from:"R3_G02",to:"R3c",distance:8,floor:1,type:"corridor" },
  { from:"R3_st",to:"R3c",distance:8,floor:1,type:"corridor" },
  { from:"R3_lf",to:"R3c",distance:8,floor:1,type:"corridor" },
  // Inter-block: E↔C connector corridor
  { from:"E_ib",to:"conn_EC_1",distance:12,floor:1,type:"corridor" },
  { from:"conn_EC_1",to:"conn_EC_2",distance:18,floor:1,type:"corridor" },
  { from:"conn_EC_2",to:"C_entE",distance:22,floor:1,type:"corridor" },
  // Inter-block: A↔C connector corridor
  { from:"A_ib",to:"conn_AC_1",distance:12,floor:1,type:"corridor" },
  { from:"conn_AC_1",to:"conn_AC_2",distance:18,floor:1,type:"corridor" },
  { from:"conn_AC_2",to:"C_entA",distance:22,floor:1,type:"corridor" },
  // Inter-block: C→D connector (gem left → D block)
  { from:"Dl",to:"conn_CD_1",distance:24,floor:1,type:"corridor" },
  { from:"conn_CD_1",to:"conn_CD_2",distance:30,floor:1,type:"corridor" },
  { from:"conn_CD_2",to:"conn_CD_3",distance:30,floor:1,type:"corridor" },
  { from:"conn_CD_3",to:"conn_CD_4",distance:30,floor:1,type:"corridor" },
  { from:"conn_CD_4",to:"Db_en",distance:18,floor:1,type:"corridor" },
  // Inter-block: C→B connector (gem right → B block)
  { from:"Dr",to:"conn_CB_1",distance:24,floor:1,type:"corridor" },
  { from:"conn_CB_1",to:"conn_CB_2",distance:30,floor:1,type:"corridor" },
  { from:"conn_CB_2",to:"conn_CB_3",distance:30,floor:1,type:"corridor" },
  { from:"conn_CB_3",to:"conn_CB_4",distance:30,floor:1,type:"corridor" },
  { from:"conn_CB_4",to:"Bb_en",distance:18,floor:1,type:"corridor" },

  // ═══ D BLOCK (no external entrance) ═══
  { from:"Db_en",to:"Db_i1",distance:20,floor:1,type:"corridor" },
  { from:"Db_i1",to:"Db_i2",distance:22,floor:1,type:"corridor" },
  { from:"D_G72",to:"Db_i1",distance:8,floor:1,type:"corridor" },
  { from:"Db_sl",to:"Db_i2",distance:8,floor:1,type:"corridor" },
  { from:"Db_lf",to:"Db_i2",distance:8,floor:1,type:"corridor" },
  { from:"D_G68",to:"Db_i2",distance:10,floor:1,type:"corridor" },

  // ═══ B BLOCK (simplified) ═══
  { from:"Bb_en",to:"Bb_i1",distance:20,floor:1,type:"corridor" },
  { from:"Bb_i1",to:"Bb_i2",distance:22,floor:1,type:"corridor" },
  { from:"Bb_i2",to:"Bb_ex",distance:25,floor:1,type:"corridor" },
  { from:"B_G60",to:"Bb_i1",distance:8,floor:1,type:"corridor" },
  { from:"B_G61",to:"Bb_i1",distance:8,floor:1,type:"corridor" },
  { from:"B_mr",to:"Bb_i1",distance:10,floor:1,type:"corridor" },
  { from:"Bb_sl",to:"Bb_i2",distance:8,floor:1,type:"corridor" },
  { from:"Bb_lf",to:"Bb_i2",distance:8,floor:1,type:"corridor" },
  { from:"B_G67",to:"Bb_i2",distance:8,floor:1,type:"corridor" },
  { from:"B_wr",to:"Bb_ex",distance:8,floor:1,type:"corridor" },
  { from:"B_wr",to:"Bb_i2",distance:12,floor:1,type:"corridor" },

  // ═══ COURTYARD (vertical line to C1, crosses E1-A1 horizontal) ═══
  { from:"Courtyard",to:"court_cross",distance:72,floor:1,type:"corridor" },
  // Horizontal: E1 → court_toE → court_cross → court_toA → A1
  { from:"E1",to:"court_toE",distance:85,floor:1,type:"corridor" },
  { from:"court_toE",to:"court_cross",distance:100,floor:1,type:"corridor" },
  { from:"court_cross",to:"court_toA",distance:100,floor:1,type:"corridor" },
  { from:"court_toA",to:"A1",distance:85,floor:1,type:"corridor" },
  // Vertical: court_cross → C1
  { from:"court_cross",to:"court_path1",distance:148,floor:1,type:"corridor" },
  { from:"court_path1",to:"court_path2",distance:130,floor:1,type:"corridor" },
  { from:"court_path2",to:"C1",distance:100,floor:1,type:"corridor" },

  // ═══ PRP BACK ENTRANCE (connects to D entrance from C) ═══
  { from:"PRP_back",to:"C3",distance:90,floor:1,type:"corridor" },
  { from:"PRP_back",to:"Db_en",distance:80,floor:1,type:"corridor" },
]

// Clone edges for other floors
function cloneEdges(edges: NavEdge[], floor: number, prefix: string): NavEdge[] {
  return edges.map(e => ({ ...e, from: prefix+e.from, to: prefix+e.to, floor }))
}

// Cross-floor connections (stairs/lifts between floors)
function crossFloorEdges(stairLiftIds: string[], prefixA: string, prefixB: string, floorA: number): NavEdge[] {
  return stairLiftIds.flatMap(id => [
    { from: prefixA+id, to: prefixB+id, distance: 5, floor: floorA, type: "stairs" as const },
  ])
}

const STAIR_LIFT_IDS = [
  "E_s1","E_lf1","E_st2","E_sl3","E_lf3",
  "A_s1","A_lf1","A_sl_ul","A_sl_ll",
  "L3_st","L3_lf","Gem_st_l","Gem_lf_l","Gem_st_r","Gem_lf_r",
  "R1_st","R1_lf","R3_st","R3_lf",
  "Db_sl","Db_lf","Bb_sl","Bb_lf",
]

// Filter edges that reference ground-only nodes before cloning to upper floors
const _cloneableEdges = _groundEdges.filter(e =>
  !GROUND_ONLY_IDS.has(e.from) && !GROUND_ONLY_IDS.has(e.to)
)

export const navEdges: NavEdge[] = [
  ..._groundEdges,
  ...cloneEdges(_cloneableEdges, 2, "F1_"),
  ...cloneEdges(_cloneableEdges, 3, "F2_"),
  ...crossFloorEdges(STAIR_LIFT_IDS, "", "F1_", 1),
  ...crossFloorEdges(STAIR_LIFT_IDS, "F1_", "F2_", 2),
]