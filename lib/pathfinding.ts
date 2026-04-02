import { navNodes, navEdges } from "./prp-navigation-graph"
import type { NavNode, NodeCategory } from "./prp-navigation-graph"

export interface PathStep {
  nodeId: string
  nodeName: string
  x: number
  y: number
  floor: number
  block: string
  type: "room" | "corridor" | "intersection" | "stairs" | "elevator" | "entrance"
  instruction?: string
}

export interface Route {
  steps: PathStep[]
  totalDistance: number
  floorChanges: number
}

interface OpenNode {
  nodeId: string
  gScore: number
  fScore: number
}

function heuristic(a: NavNode, b: NavNode): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  const floorPenalty = a.floor !== b.floor ? 200 : 0
  return Math.sqrt(dx * dx + dy * dy) + floorPenalty
}

export function findShortestPath(startId: string, endId: string): Route | null {
  const startNode = navNodes.find((n) => n.id === startId)
  const endNode = navNodes.find((n) => n.id === endId)
  if (!startNode || !endNode) return null

  const openSet = new Map<string, OpenNode>()
  const closedSet = new Set<string>()
  const gScore = new Map<string, number>()
  const cameFrom = new Map<string, string>()

  openSet.set(startId, { nodeId: startId, gScore: 0, fScore: heuristic(startNode, endNode) })
  gScore.set(startId, 0)

  while (openSet.size > 0) {
    const current = [...openSet.values()].reduce((a, b) => (a.fScore < b.fScore ? a : b))

    if (current.nodeId === endId) {
      const path: string[] = [endId]
      let cid = endId
      while (cameFrom.has(cid)) {
        cid = cameFrom.get(cid)!
        path.unshift(cid)
      }
      return buildRoute(path)
    }

    openSet.delete(current.nodeId)
    closedSet.add(current.nodeId)

    const edges = navEdges.filter((e) => e.from === current.nodeId || e.to === current.nodeId)

    for (const edge of edges) {
      const nid = edge.from === current.nodeId ? edge.to : edge.from
      if (closedSet.has(nid)) continue

      const tentG = current.gScore + edge.distance
      if (tentG < (gScore.get(nid) ?? Infinity)) {
        cameFrom.set(nid, current.nodeId)
        gScore.set(nid, tentG)
        const neighbor = navNodes.find((n) => n.id === nid)
        if (!neighbor) continue
        openSet.set(nid, { nodeId: nid, gScore: tentG, fScore: tentG + heuristic(neighbor, endNode) })
      }
    }
  }

  return null
}

// ── Dijkstra nearest-facility search ──

export function findNearestByCategory(
  startId: string,
  categories: NodeCategory[]
): Route | null {
  const startNode = navNodes.find((n) => n.id === startId)
  if (!startNode) return null

  // Target node IDs matching the categories
  const targetIds = new Set(
    navNodes
      .filter((n) => {
        const cat = n.category || ""
        return categories.includes(cat as NodeCategory)
      })
      .map((n) => n.id)
  )
  if (targetIds.size === 0) return null

  // Dijkstra from startId
  const dist = new Map<string, number>()
  const prev = new Map<string, string>()
  const visited = new Set<string>()
  dist.set(startId, 0)

  // Simple priority queue via sorted array
  const queue: { id: string; d: number }[] = [{ id: startId, d: 0 }]

  while (queue.length > 0) {
    queue.sort((a, b) => a.d - b.d)
    const { id: uid } = queue.shift()!
    if (visited.has(uid)) continue
    visited.add(uid)

    // Found a target!
    if (targetIds.has(uid) && uid !== startId) {
      const path: string[] = [uid]
      let cid = uid
      while (prev.has(cid)) {
        cid = prev.get(cid)!
        path.unshift(cid)
      }
      return buildRoute(path)
    }

    const edges = navEdges.filter((e) => e.from === uid || e.to === uid)
    for (const edge of edges) {
      const vid = edge.from === uid ? edge.to : edge.from
      if (visited.has(vid)) continue
      const alt = (dist.get(uid) ?? Infinity) + edge.distance
      if (alt < (dist.get(vid) ?? Infinity)) {
        dist.set(vid, alt)
        prev.set(vid, uid)
        queue.push({ id: vid, d: alt })
      }
    }
  }

  return null
}

function buildRoute(path: string[]): Route {
  let totalDistance = 0
  let prevFloor = -1
  let floorChanges = 0

  const steps: PathStep[] = path.map((nodeId, i) => {
    const node = navNodes.find((n) => n.id === nodeId)!
    if (prevFloor !== -1 && node.floor !== prevFloor) floorChanges++
    prevFloor = node.floor

    if (i < path.length - 1) {
      const next = path[i + 1]
      const edge = navEdges.find(
        (e) => (e.from === nodeId && e.to === next) || (e.to === nodeId && e.from === next),
      )
      if (edge) totalDistance += edge.distance
    }

    return {
      nodeId: node.id,
      nodeName: node.name,
      x: node.x,
      y: node.y,
      floor: node.floor,
      block: node.block,
      type: node.type,
      instruction: makeInstruction(node, i, path.length),
    }
  })

  return { steps, totalDistance, floorChanges }
}

function makeInstruction(node: NavNode, idx: number, total: number): string {
  if (idx === 0) return `Start at ${node.name}`
  if (idx === total - 1) return `Arrive at ${node.name}`
  switch (node.type) {
    case "intersection": return `Continue through ${node.name}`
    case "stairs": return `Take ${node.name}`
    case "elevator": return `Take ${node.name}`
    case "entrance": return `Pass through ${node.name}`
    case "corridor": return `Walk along ${node.name}`
    default: return `Proceed towards ${node.name}`
  }
}