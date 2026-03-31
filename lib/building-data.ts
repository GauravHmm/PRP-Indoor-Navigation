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
    category: n.type,
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
      (r.description?.toLowerCase().includes(lowerQuery) ?? false),
  )
}
