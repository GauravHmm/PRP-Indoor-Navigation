"use client"

import { useEffect, useRef } from "react"

interface CursorProps {
  subtle?: boolean
}

export function CustomCursor({ subtle = false }: CursorProps) {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })
  const hovered = useRef(false)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX
      pos.current.y = e.clientY
    }

    let raf: number
    const animate = () => {
      // Dot follows instantly
      dot.style.left = pos.current.x + "px"
      dot.style.top = pos.current.y + "px"

      // Ring lags behind smoothly
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.15
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.15
      ring.style.left = ringPos.current.x + "px"
      ring.style.top = ringPos.current.y + "px"

      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    const expand = () => {
      hovered.current = true
      ring.style.width = "36px"
      ring.style.height = "36px"
      ring.style.borderColor = "rgba(34,211,238,0.5)"
      dot.style.background = "#22d3ee"
    }
    const shrink = () => {
      hovered.current = false
      ring.style.width = subtle ? "20px" : "24px"
      ring.style.height = subtle ? "20px" : "24px"
      ring.style.borderColor = "rgba(148,163,184,0.25)"
      dot.style.background = subtle ? "rgba(34,211,238,0.5)" : "#22d3ee"
    }

    document.addEventListener("mousemove", onMove)

    const bind = () => {
      document.querySelectorAll("a, button, [role='button'], input, select, .cursor-hover").forEach(el => {
        el.addEventListener("mouseenter", expand)
        el.addEventListener("mouseleave", shrink)
      })
    }

    bind()
    const observer = new MutationObserver(bind)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [subtle])

  const dotSize = subtle ? 4 : 6
  const ringSize = subtle ? 20 : 24

  const base: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    pointerEvents: "none",
    zIndex: 9999,
    transform: "translate(-50%, -50%)",
    borderRadius: "50%",
  }

  return (
    <>
      <style>{`
        @media (hover: hover) and (pointer: fine) {
          body, body * { cursor: none !important; }
        }
        @media (hover: none), (pointer: coarse) {
          .prp-dot, .prp-ring { display: none !important; }
        }
      `}</style>
      <div ref={dotRef} className="prp-dot" style={{
        ...base,
        width: dotSize,
        height: dotSize,
        background: subtle ? "rgba(34,211,238,0.5)" : "#22d3ee",
        transition: "background 0.2s",
      }} />
      <div ref={ringRef} className="prp-ring" style={{
        ...base,
        width: ringSize,
        height: ringSize,
        background: "transparent",
        border: "1.5px solid rgba(148,163,184,0.25)",
        transition: "width 0.25s ease, height 0.25s ease, border-color 0.25s ease",
      }} />
    </>
  )
}
