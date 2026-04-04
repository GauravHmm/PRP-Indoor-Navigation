// ============================================================
// PRP Building — Data Interfaces & Utilities
// Re-exports node/edge data from the navigation graph
// ============================================================

// Re-export types and data from the navigation graph
export type { NavNode, NavEdge } from "./prp-navigation-graph"
export { navNodes, navEdges } from "./prp-navigation-graph"

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

// Build rooms list from navNodes (only navigable destinations)
import { navNodes } from "./prp-navigation-graph"

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
    category: n.category ?? n.type,
    description: n.description,
  }))

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
      (r.description?.toLowerCase().includes(lowerQuery) ?? false) ||
      r.category.toLowerCase().includes(lowerQuery),
  )
}

// ── Category system ──────────────────────────────────────────

export const CATEGORY_LABELS: Record<string, { label: string; icon: string }> = {
  water:            { label: "Water",            icon: "💧" },
  washroom_male:    { label: "Men's Washroom",   icon: "🚹" },
  washroom_female:  { label: "Women's Washroom", icon: "🚺" },
  sitting:          { label: "Sitting Area",     icon: "🪑" },
  stairs:           { label: "Stairs",           icon: "🪜" },
  lift:             { label: "Lift",             icon: "🛗" },
  lab:              { label: "Lab",              icon: "🔬" },
  electrical:       { label: "Electrical Room",  icon: "⚡" },
  stationary:       { label: "Stationary",       icon: "📎" },
  canteen:          { label: "Canteen",          icon: "🍽️" },
  office:           { label: "Office",           icon: "🏢" },
  room:             { label: "Room",             icon: "🏫" },
  entrance:         { label: "Entrance",         icon: "🚪" },
}

// Quick-action categories (shown as buttons in the UI)
export const QUICK_CATEGORIES = [
  "water", "washroom_male", "washroom_female", "sitting", "canteen", "stairs", "lift",
] as const

// Keyword → category mapping for natural language search
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  water:           ["water", "drinking", "drink"],
  washroom_male:   ["men washroom", "men's washroom", "male washroom", "gents"],
  washroom_female: ["women washroom", "women's washroom", "female washroom", "ladies"],
  sitting:         ["sitting", "sit", "seat", "rest"],
  stairs:          ["stairs", "staircase", "stairway"],
  lift:            ["lift", "elevator"],
  lab:             ["lab", "laboratory"],
  electrical:      ["electrical", "electric"],
  stationary:      ["stationary", "stationery"],
  canteen:         ["canteen", "cafeteria", "food", "eat"],
  office:          ["office", "faculty", "cabin"],
}

// Broad aliases that match multiple categories
const BROAD_ALIASES: Record<string, string[]> = {
  washroom:  ["washroom_male", "washroom_female"],
  toilet:    ["washroom_male", "washroom_female"],
  restroom:  ["washroom_male", "washroom_female"],
  wr:        ["washroom_male", "washroom_female"],
}

/**
 * Match a search query to a single category.
 * Returns null if no category matches — caller should fall back to text search.
 */
export function matchCategory(query: string): string | null {
  const lower = query.toLowerCase().trim()

  // Exact broad aliases first
  for (const [alias, _cats] of Object.entries(BROAD_ALIASES)) {
    if (lower === alias || lower.includes(alias)) {
      // Return the first matching category (UI can handle both)
      return _cats[0]
    }
  }

  // Specific keyword matching
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k) || k.includes(lower))) {
      return cat
    }
  }

  return null
}

/**
 * Get all categories that a broad query might match (e.g. "washroom" → male + female)
 */
export function matchBroadCategories(query: string): string[] {
  const lower = query.toLowerCase().trim()

  for (const [alias, cats] of Object.entries(BROAD_ALIASES)) {
    if (lower === alias || lower.includes(alias)) {
      return cats
    }
  }

  const single = matchCategory(query)
  return single ? [single] : []
}
