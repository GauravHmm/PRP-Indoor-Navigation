// ============================================================
// PRP Building — Data Interfaces & Utilities
// Category-aware search + nearest facility support
// ============================================================

export type { NavNode, NavEdge, NodeCategory } from "./prp-navigation-graph"
export { navNodes, navEdges } from "./prp-navigation-graph"
import { navNodes } from "./prp-navigation-graph"
import type { NavNode, NodeCategory } from "./prp-navigation-graph"

export interface Room {
  id: string
  name: string
  floor: number
  block: string
  x: number
  y: number
  category: string
  description?: string
}

const NAVIGABLE_TYPES = new Set(["room", "entrance", "stairs", "elevator"])

export const rooms: Room[] = navNodes
  .filter((n) => NAVIGABLE_TYPES.has(n.type))
  .map((n) => ({
    id: n.id,
    name: n.name,
    floor: n.floor,
    block: n.block,
    x: n.x,
    y: n.y,
    category: n.category || deriveCategory(n),
    description: n.description,
  }))

// ── Category derivation (fallback when category not set) ──

function deriveCategory(n: NavNode): string {
  if (n.type === "stairs") return "stairs"
  if (n.type === "elevator") return "lift"
  const lower = `${n.name} ${n.description || ""}`.toLowerCase()
  if (lower.includes("water") || lower.includes("drinking")) return "water"
  if (lower.includes("women") || lower.includes("female")) return "washroom_female"
  if (lower.includes("men") || lower.includes("male")) return "washroom_male"
  if (lower.includes("washroom") || lower.includes("wr")) return "washroom_male"
  if (lower.includes("sitting")) return "sitting"
  if (lower.includes("lab")) return "lab"
  if (lower.includes("canteen")) return "canteen"
  if (lower.includes("office") || lower.includes("faculty") || lower.includes("cabin")) return "office"
  if (lower.includes("electrical")) return "electrical"
  if (lower.includes("stationary") || lower.includes("stationery")) return "stationary"
  return "general"
}

// ── Category keyword map for search ──

const CATEGORY_KEYWORDS: Record<string, NodeCategory[]> = {
  water: ["water"],
  drinking: ["water"],
  washroom: ["washroom_male", "washroom_female"],
  bathroom: ["washroom_male", "washroom_female"],
  toilet: ["washroom_male", "washroom_female"],
  "men's washroom": ["washroom_male"],
  "women's washroom": ["washroom_female"],
  sitting: ["sitting"],
  "sitting area": ["sitting"],
  lab: ["lab"],
  canteen: ["canteen"],
  food: ["canteen"],
  stairs: ["stairs"],
  lift: ["lift"],
  elevator: ["lift"],
  electrical: ["electrical"],
  stationary: ["stationary"],
  stationery: ["stationary"],
  office: ["office"],
  faculty: ["office"],
}

/** Check if a query matches a facility category */
export function matchCategory(query: string): NodeCategory[] | null {
  const q = query.toLowerCase().trim()
  for (const [keyword, cats] of Object.entries(CATEGORY_KEYWORDS)) {
    if (q === keyword || q.includes(keyword)) return cats
  }
  return null
}

/** Get all rooms matching specific categories */
export function getRoomsByCategory(categories: NodeCategory[]): Room[] {
  return rooms.filter((r) => categories.includes(r.category as NodeCategory))
}

// ── Standard search functions ──

export function getAllRooms(): Room[] {
  return rooms
}

export function findRoomById(roomId: string): Room | undefined {
  return rooms.find((r) => r.id === roomId)
}

export function searchRooms(query: string): Room[] {
  const lowerQuery = query.toLowerCase()
  return rooms.filter(
    (r) =>
      r.name.toLowerCase().includes(lowerQuery) ||
      r.block.toLowerCase().includes(lowerQuery) ||
      r.category.toLowerCase().includes(lowerQuery) ||
      (r.description?.toLowerCase().includes(lowerQuery) ?? false),
  )
}

/** Get nearest node to given SVG coordinates */
export function getNearestNodeFromCoordinates(x: number, y: number): NavNode | null {
  let best: NavNode | null = null
  let bestDist = Infinity
  for (const n of navNodes) {
    const d = Math.hypot(n.x - x, n.y - y)
    if (d < bestDist) { bestDist = d; best = n }
  }
  return best
}
