import { findShortestPath } from "@/lib/pathfinding"
import { navNodes } from "@/lib/building-data"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startNodeId = searchParams.get("start")
    const endNodeId = searchParams.get("end")

    if (!startNodeId || !endNodeId) {
      return NextResponse.json({ error: "Missing start or end parameters" }, { status: 400 })
    }

    // Validate nodes exist
    const startNode = navNodes.find((n) => n.id === startNodeId)
    const endNode = navNodes.find((n) => n.id === endNodeId)

    if (!startNode || !endNode) {
      return NextResponse.json({ error: "Invalid start or end node" }, { status: 404 })
    }

    // Find route
    const route = findShortestPath(startNodeId, endNodeId)

    if (!route) {
      return NextResponse.json({ error: "No route found" }, { status: 404 })
    }

    return NextResponse.json(route)
  } catch (error) {
    console.error("Route calculation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
