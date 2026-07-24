import { navNodes, navEdges } from "./prp-navigation-graph"
import type { NavNode, NavEdge } from "./prp-navigation-graph"

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

// ══════════════════════════════════════════════════════════════
// PRE-COMPUTED LOOKUP STRUCTURES
// Built once at module load — eliminates O(n) scans in hot paths
// ══════════════════════════════════════════════════════════════

interface AdjEntry {
  neighborId: string
  distance: number
  edgeType: NavEdge["type"]
}

/** O(1) node lookup by ID (replaces navNodes.find()) */
const nodeMap = new Map<string, NavNode>()
for (const node of navNodes) {
  nodeMap.set(node.id, node)
}

/** O(1) neighbor lookup by node ID (replaces navEdges.filter()) */
const adjacencyList = new Map<string, AdjEntry[]>()
for (const edge of navEdges) {
  // Add forward direction
  let fromList = adjacencyList.get(edge.from)
  if (!fromList) { fromList = []; adjacencyList.set(edge.from, fromList) }
  fromList.push({ neighborId: edge.to, distance: edge.distance, edgeType: edge.type })

  // Add reverse direction (graph is undirected)
  let toList = adjacencyList.get(edge.to)
  if (!toList) { toList = []; adjacencyList.set(edge.to, toList) }
  toList.push({ neighborId: edge.from, distance: edge.distance, edgeType: edge.type })
}

/** O(1) edge lookup between two specific nodes (replaces navEdges.find()) */
const edgeMap = new Map<string, number>()
for (const edge of navEdges) {
  // Store distance keyed by both directions
  edgeMap.set(`${edge.from}→${edge.to}`, edge.distance)
  edgeMap.set(`${edge.to}→${edge.from}`, edge.distance)
}

// ══════════════════════════════════════════════════════════════
// A* PATHFINDING
// ══════════════════════════════════════════════════════════════

function heuristic(a: NavNode, b: NavNode): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  const floorPenalty = a.floor !== b.floor ? 200 : 0
  return Math.sqrt(dx * dx + dy * dy) + floorPenalty
}

export function findShortestPath(startId: string, endId: string): Route | null {
  const startNode = nodeMap.get(startId)
  const endNode = nodeMap.get(endId)
  if (!startNode || !endNode) return null

  const openSet = new Map<string, { gScore: number; fScore: number }>()
  const closedSet = new Set<string>()
  const gScore = new Map<string, number>()
  const cameFrom = new Map<string, string>()

  openSet.set(startId, { gScore: 0, fScore: heuristic(startNode, endNode) })
  gScore.set(startId, 0)

  while (openSet.size > 0) {
    // Find node with lowest fScore — iterate the map directly (no spread + reduce)
    let bestId = ""
    let bestF = Infinity
    for (const [id, entry] of openSet) {
      if (entry.fScore < bestF) {
        bestF = entry.fScore
        bestId = id
      }
    }

    if (bestId === endId) {
      const path: string[] = [endId]
      let cid = endId
      while (cameFrom.has(cid)) {
        cid = cameFrom.get(cid)!
        path.unshift(cid)
      }
      return buildRoute(path)
    }

    const currentG = openSet.get(bestId)!.gScore
    openSet.delete(bestId)
    closedSet.add(bestId)

    // O(1) neighbor lookup instead of navEdges.filter()
    const neighbors = adjacencyList.get(bestId)
    if (!neighbors) continue

    for (const { neighborId, distance } of neighbors) {
      if (closedSet.has(neighborId)) continue

      const tentG = currentG + distance
      if (tentG < (gScore.get(neighborId) ?? Infinity)) {
        cameFrom.set(neighborId, bestId)
        gScore.set(neighborId, tentG)
        // O(1) node lookup instead of navNodes.find()
        const neighbor = nodeMap.get(neighborId)
        if (!neighbor) continue
        openSet.set(neighborId, { gScore: tentG, fScore: tentG + heuristic(neighbor, endNode) })
      }
    }
  }

  return null
}

// ══════════════════════════════════════════════════════════════
// ROUTE BUILDING
// ══════════════════════════════════════════════════════════════

function buildRoute(path: string[]): Route {
  let totalDistance = 0
  let prevFloor = -1
  let floorChanges = 0

  const steps: PathStep[] = path.map((nodeId, i) => {
    const node = nodeMap.get(nodeId)!
    if (prevFloor !== -1 && node.floor !== prevFloor) floorChanges++
    prevFloor = node.floor

    if (i < path.length - 1) {
      const next = path[i + 1]
      // O(1) edge distance lookup instead of navEdges.find()
      const dist = edgeMap.get(`${nodeId}→${next}`)
      if (dist !== undefined) totalDistance += dist
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

// ══════════════════════════════════════════════════════════════
// DIJKSTRA: FIND NEAREST NODE BY CATEGORY
// Uses binary insertion to maintain a sorted priority queue
// instead of re-sorting the entire array on every iteration.
// ══════════════════════════════════════════════════════════════

/** Binary search for insertion index in a sorted array (ascending by .d) */
function binaryInsert(queue: { id: string; d: number }[], entry: { id: string; d: number }): void {
  let lo = 0, hi = queue.length
  while (lo < hi) {
    const mid = (lo + hi) >>> 1
    if (queue[mid].d < entry.d) lo = mid + 1
    else hi = mid
  }
  queue.splice(lo, 0, entry)
}

export function findNearestByCategory(
  startId: string,
  category: string
): Route | null {
  if (!nodeMap.has(startId)) return null

  const dist = new Map<string, number>()
  const prev = new Map<string, string>()
  const visited = new Set<string>()
  // Queue stays sorted via binary insertion — no re-sort needed
  const queue: { id: string; d: number }[] = [{ id: startId, d: 0 }]
  dist.set(startId, 0)

  while (queue.length > 0) {
    // Already sorted — just shift the minimum
    const { id: currId } = queue.shift()!

    if (visited.has(currId)) continue
    visited.add(currId)

    const currNode = nodeMap.get(currId)
    if (!currNode) continue

    // Found a target?
    if (currId !== startId && currNode.category === category) {
      const path: string[] = [currId]
      let cid = currId
      while (prev.has(cid)) {
        cid = prev.get(cid)!
        path.unshift(cid)
      }
      return buildRoute(path)
    }

    // O(1) neighbor lookup instead of navEdges.filter()
    const neighbors = adjacencyList.get(currId)
    if (!neighbors) continue

    for (const { neighborId, distance } of neighbors) {
      if (visited.has(neighborId)) continue
      const currDist = dist.get(currId) ?? 0
      const newDist = currDist + distance
      if (newDist < (dist.get(neighborId) ?? Infinity)) {
        dist.set(neighborId, newDist)
        prev.set(neighborId, currId)
        // Binary insertion maintains sort order — O(log n) per insert
        binaryInsert(queue, { id: neighborId, d: newDist })
      }
    }
  }

  return null
}

// ── Find all nodes of a given category (sorted by distance) ──

export function findAllByCategory(
  startId: string,
  category: string
): { node: NavNode; route: Route }[] {
  // Pre-filter targets using nodeMap values (still need a full scan here,
  // but this runs rarely and outside the hot pathfinding loop)
  const targets: NavNode[] = []
  for (const node of nodeMap.values()) {
    if (node.category === category) targets.push(node)
  }

  const results: { node: NavNode; route: Route }[] = []
  for (const target of targets) {
    const route = findShortestPath(startId, target.id)
    if (route) results.push({ node: target, route })
  }

  results.sort((a, b) => a.route.totalDistance - b.route.totalDistance)
  return results
}

// ── Get nearest graph node from raw (x, y) coordinates ──────

export function getNearestNodeFromCoordinates(
  x: number,
  y: number
): NavNode | null {
  let best: NavNode | null = null
  let bestDist = Infinity

  for (const node of nodeMap.values()) {
    const dx = node.x - x
    const dy = node.y - y
    const d = dx * dx + dy * dy
    if (d < bestDist) {
      bestDist = d
      best = node
    }
  }

  return best
}