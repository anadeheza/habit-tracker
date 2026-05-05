import { useState, useRef, useEffect } from "react";

function randomBetween(a, b) {
    return a + Math.random() * (b - a)
}

export default function Confetti({ trigger }) {
    const canvasRef = useRef(null)
    const animRef = useRef(null)

    useEffect(() => {
        if(!trigger) return
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const COLORS = [
            "#aaacf7",
            "#70c8ab",
            "#e1b160",
            "#e57979",
            "#dda3fa",
            "#9dc0f9",
            "#e78fbb",
            "#f9c74f"
        ]

        const particles = Array.from({ length: 120 }, () => ({
            x: randomBetween(canvas.width * 0.2, canvas.width * 0.8),
            y: randomBetween(-30, canvas.height * 0.3),
            r: randomBetween(4, 9),
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            vx: randomBetween(-3, 3),
            vy: randomBetween(-6, 2),
            gravity: randomBetween(0.12, 0.25),
            wobble: randomBetween(0, Math.PI * 2),
            wobbleSpeed: randomBetween(0.05, 0.12),
            shape: Math.random() > 0.5 ? "circle" : "rect",
            alpha: 1,
            decay: randomBetween(0.008, 0.018)
        }))

        let alive = true 

        const draw = () => {
            if (!alive) return 
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            let anyVisible = false 
            for(const p of particles) {
                p.vy += p.gravity
                p.x += p.vx + Math.sin(p.wobble) * 1.2 
                p.y += p.vy 
                p.wobble += p.wobbleSpeed
                p.alpha -= p.decay

                if (p.alpha <= 0) continue
                anyVisible = true

                ctx.save()
                ctx.globalAlpha = p.alpha
                ctx.fillStyle = p.color
                ctx.translate(p.x, p.y)
                ctx.rotate(p.wobble)

                if (p.shape === "circle") {
                    ctx.beginPath()
                    ctx.arc(0, 0, p.r, 0, Math.PI * 2)
                    ctx.fill()
                } else {
                    ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r)
                }
                ctx.restore()
            }

            if (anyVisible) {
                animRef.current = requestAnimationFrame(draw)
            } else {
                alive = false
            }
        }

        animRef.current = requestAnimationFrame(draw)
        return () => {
            alive = false
            cancelAnimationFrame(animRef.current)
        }
    }, [trigger])

    if (!trigger) return null

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[100]"
            style={{ width: "100vw", height: "100vh" }}
        />
    )
}

