export function buildSvgPath(points: { x: number; y: number }[]) {
  if (!points.length) return ""
  const start = `M ${points[0].x} ${points[0].y}`
  const lines = points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ")
  return `${start} ${lines}`
}

export function interpolatePath(
  points: { x: number; y: number }[],
  smoothing: number = 0.5
): { x: number; y: number }[] {
  if (points.length < 2) return points
  const smoothed: { x: number; y: number }[] = [points[0]]

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const next = points[i + 1]

    const midX = prev.x + (next.x - prev.x) * smoothing
    const midY = prev.y + (next.y - prev.y) * smoothing

    smoothed.push({ x: midX, y: midY })
    smoothed.push(curr)
  }

  smoothed.push(points[points.length - 1])
  return smoothed
}
