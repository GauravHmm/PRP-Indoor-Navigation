"use client"

import { useEffect, useRef, useCallback } from "react"

interface CursorProps {
  subtle?: boolean
}

export function CustomCursor({ subtle = false }: CursorProps) {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  // Mouse target position (raw input)
  const mouse = useRef({ x: -100, y: -100 })
  // Smoothed positions for dot and ring
  const dotPos = useRef({ x: -100, y: -100 })
  const ringPos = useRef({ x: -100, y: -100 })
  // Ring velocity for spring-damper physics
  const ringVel = useRef({ x: 0, y: 0 })
  const hovered = useRef(false)
  const visible = useRef(false)

  const applyTransform = useCallback((el: HTMLDivElement, x: number, y: number) => {
    el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
  }, [])

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // Track raw mouse position
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
      if (!visible.current) {
        visible.current = true
        dot.style.opacity = "1"
        ring.style.opacity = "1"
      }
    }

    const onLeave = () => {
      visible.current = false
      dot.style.opacity = "0"
      ring.style.opacity = "0"
    }

    // Lerp helper
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    // Spring-damper constants for ring
    const SPRING_STIFFNESS = 0.08
    const SPRING_DAMPING = 0.72

    // Dot smoothing factor (high = more responsive, 1 = instant)
    const DOT_SMOOTH = 0.55

    let raf: number
    let lastTime = performance.now()

    const animate = (now: number) => {
      // Delta-time normalization (target 60fps)
      const dt = Math.min((now - lastTime) / 16.667, 2)
      lastTime = now

      const mx = mouse.current.x
      const my = mouse.current.y

      // --- Dot: fast lerp for silky-smooth tracking ---
      const dotSmooth = 1 - Math.pow(1 - DOT_SMOOTH, dt)
      dotPos.current.x = lerp(dotPos.current.x, mx, dotSmooth)
      dotPos.current.y = lerp(dotPos.current.y, my, dotSmooth)
      applyTransform(dot, dotPos.current.x, dotPos.current.y)

      // --- Ring: spring-damper physics for organic trailing ---
      const dx = mx - ringPos.current.x
      const dy = my - ringPos.current.y

      // Spring force
      ringVel.current.x += dx * SPRING_STIFFNESS * dt
      ringVel.current.y += dy * SPRING_STIFFNESS * dt

      // Damping
      ringVel.current.x *= Math.pow(SPRING_DAMPING, dt)
      ringVel.current.y *= Math.pow(SPRING_DAMPING, dt)

      ringPos.current.x += ringVel.current.x * dt
      ringPos.current.y += ringVel.current.y * dt
      applyTransform(ring, ringPos.current.x, ringPos.current.y)

      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    // Hover state handlers
    const expand = () => {
      hovered.current = true
      ring.style.width = "40px"
      ring.style.height = "40px"
      ring.style.borderColor = "rgba(34,211,238,0.6)"
      ring.style.borderWidth = "2px"
      dot.style.width = "4px"
      dot.style.height = "4px"
      dot.style.background = "#22d3ee"
      dot.style.boxShadow = "0 0 8px rgba(34,211,238,0.6)"
    }
    const shrink = () => {
      hovered.current = false
      ring.style.width = subtle ? "20px" : "26px"
      ring.style.height = subtle ? "20px" : "26px"
      ring.style.borderColor = "rgba(148,163,184,0.3)"
      ring.style.borderWidth = "1.5px"
      const ds = subtle ? 4 : 6
      dot.style.width = ds + "px"
      dot.style.height = ds + "px"
      dot.style.background = subtle ? "rgba(34,211,238,0.5)" : "#22d3ee"
      dot.style.boxShadow = subtle ? "none" : "0 0 6px rgba(34,211,238,0.3)"
    }

    document.addEventListener("mousemove", onMove, { passive: true })
    document.addEventListener("mouseleave", onLeave)

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
      document.removeEventListener("mouseleave", onLeave)
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [subtle, applyTransform])

  const dotSize = subtle ? 4 : 6
  const ringSize = subtle ? 20 : 26

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
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 10000,
        width: dotSize,
        height: dotSize,
        borderRadius: "50%",
        background: subtle ? "rgba(34,211,238,0.5)" : "#22d3ee",
        boxShadow: subtle ? "none" : "0 0 6px rgba(34,211,238,0.3)",
        opacity: 0,
        willChange: "transform",
        transition: "width 0.3s cubic-bezier(0.25,1,0.5,1), height 0.3s cubic-bezier(0.25,1,0.5,1), background 0.25s ease, box-shadow 0.25s ease, opacity 0.3s ease",
        transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
      }} />
      <div ref={ringRef} className="prp-ring" style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
        width: ringSize,
        height: ringSize,
        borderRadius: "50%",
        background: "transparent",
        border: "1.5px solid rgba(148,163,184,0.3)",
        opacity: 0,
        willChange: "transform",
        transition: "width 0.35s cubic-bezier(0.25,1,0.5,1), height 0.35s cubic-bezier(0.25,1,0.5,1), border-color 0.3s ease, border-width 0.3s ease, opacity 0.3s ease",
        transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
      }} />
    </>
  )
}
