/**
 * Build an SVG path string using smooth Catmull-Rom-style curves.
 * Falls back to straight lines for 2 points or fewer.
 */
export function buildSvgPath(points: { x: number; y: number }[]): string {
  if (!points.length) return ""
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`
  }

  // Use quadratic bezier curves for smooth path through all points
  let d = `M ${points[0].x} ${points[0].y}`

  // First segment: straight line to midpoint between p0 and p1
  const mid0x = (points[0].x + points[1].x) / 2
  const mid0y = (points[0].y + points[1].y) / 2
  d += ` L ${mid0x} ${mid0y}`

  // Middle segments: quadratic bezier curves using each point as control point
  for (let i = 1; i < points.length - 1; i++) {
    const midx = (points[i].x + points[i + 1].x) / 2
    const midy = (points[i].y + points[i + 1].y) / 2
    d += ` Q ${points[i].x} ${points[i].y} ${midx} ${midy}`
  }

  // Last segment: line to final point
  d += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`

  return d
}

/**
 * Build a straight-line SVG path (no smoothing).
 */
export function buildStraightSvgPath(points: { x: number; y: number }[]): string {
  if (!points.length) return ""
  const start = `M ${points[0].x} ${points[0].y}`
  const lines = points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ")
  return `${start} ${lines}`
}
