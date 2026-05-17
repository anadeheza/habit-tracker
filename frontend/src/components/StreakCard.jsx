import { useEffect, useRef } from "react"

function getStreak(completions) {
    if (!completions.length) return 0
    const sorted = [...completions].sort((a, b) => new Date(b) - new Date(a))
    const today = new Date().toISOString().split("T")[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]
    if (sorted[0] !== today && sorted[0] !== yesterday) return 0
    let s = 1
    for (let i = 1; i < sorted.length; i++) {
        const diff = (new Date(sorted[i - 1]) - new Date(sorted[i])) / 86400000
        if (diff === 1) s++
        else break
    }
    return s
}

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return { r, g, b }
}

function truncate(ctx, text, maxWidth) {
    if (ctx.measureText(text).width <= maxWidth) return text
    let t = text
    while (t.length > 1 && ctx.measureText(t + "…").width > maxWidth) {
        t = t.slice(0, -1)
    }
    return t + "…"
}

function drawCard(canvas, habits) {
    const ctx = canvas.getContext("2d")

    const W = 560
    const ROW_H = 52
    const VISIBLE = Math.min(habits.length, 5)
    const HEADER_H = 100
    const FOOTER_H = 36
    const H = HEADER_H + VISIBLE * ROW_H + FOOTER_H + 16
    canvas.width = W
    canvas.height = H

    const bg = ctx.createLinearGradient(0, 0, W, H)
    bg.addColorStop(0, "#141a0e")
    bg.addColorStop(1, "#0e1218")
    ctx.fillStyle = bg
    ctx.beginPath()
    ctx.roundRect(0, 0, W, H, 20)
    ctx.fill()

    ctx.fillStyle = "rgba(255,255,255,0.035)"
    for (let x = 20; x < W; x += 22) {
        for (let y = 20; y < H; y += 22) {
            ctx.beginPath()
            ctx.arc(x, y, 1, 0, Math.PI * 2)
            ctx.fill()
        }
    }

    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 22px Georgia, serif"
    ctx.textAlign = "left"
    ctx.textBaseline = "alphabetic"
    ctx.fillText("my habit streak", 32, 46)

    const dateStr = new Date().toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric"
    })
    ctx.fillStyle = "rgba(255,255,255,0.38)"
    ctx.font = "12px Georgia, serif"
    ctx.fillText(dateStr, 32, 68)

    ctx.strokeStyle = "rgba(255,255,255,0.07)"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(32, HEADER_H - 4)
    ctx.lineTo(W - 32, HEADER_H - 4)
    ctx.stroke()

    const COL_SWATCH = 32
    const COL_NAME   = 42        
    const NAME_MAX_W = 130       
    const COL_HEAT   = 190       
    const HEAT_DAYS  = 14
    const CELL = 13, GAP = 2
    const HEAT_W = HEAT_DAYS * (CELL + GAP) - GAP   
    const COL_BADGE  = COL_HEAT + HEAT_W + 10       
    const BADGE_W    = 62

    habits.slice(0, VISIBLE).forEach((h, i) => {
        const rowTop = HEADER_H + i * ROW_H
        const midY   = rowTop + ROW_H / 2
        const { r, g, b } = hexToRgb(h.color)
        const streak = getStreak(h.completions)

        ctx.fillStyle = h.color
        ctx.beginPath()
        ctx.roundRect(COL_SWATCH, rowTop + 10, 3, ROW_H - 20, 2)
        ctx.fill()

        ctx.fillStyle = "#ffffff"
        ctx.font = "600 13px Georgia, serif"
        ctx.textAlign = "left"
        ctx.textBaseline = "middle"
        const name = truncate(ctx, h.name, NAME_MAX_W)
        ctx.fillText(name, COL_NAME, midY)

        Array.from({ length: HEAT_DAYS }, (_, k) => {
            const d = new Date(Date.now() - (HEAT_DAYS - 1 - k) * 86400000)
                .toISOString().split("T")[0]
            const done = h.completions.includes(d)
            const cx = COL_HEAT + k * (CELL + GAP)
            const cy = midY - CELL / 2
            ctx.fillStyle = done ? h.color : `rgba(${r},${g},${b},0.15)`
            ctx.beginPath()
            ctx.roundRect(cx, cy, CELL, CELL, 3)
            ctx.fill()
        })

        ctx.fillStyle = `rgba(${r},${g},${b},0.22)`
        ctx.beginPath()
        ctx.roundRect(COL_BADGE, midY - 12, BADGE_W, 24, 12)
        ctx.fill()

        const fx = COL_BADGE + 14, fy = midY
        ctx.fillStyle = "#f97316"
        ctx.beginPath()
        ctx.ellipse(fx, fy + 2, 4, 6, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = "#fbbf24"
        ctx.beginPath()
        ctx.ellipse(fx, fy, 2.5, 4, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = h.color
        ctx.font = "bold 12px Georgia, serif"
        ctx.textAlign = "left"
        ctx.textBaseline = "middle"
        ctx.fillText(`${streak}d`, COL_BADGE + 23, midY)

        if (i < VISIBLE - 1) {
            ctx.strokeStyle = "rgba(255,255,255,0.05)"
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(32, rowTop + ROW_H)
            ctx.lineTo(W - 32, rowTop + ROW_H)
            ctx.stroke()
        }
    })

    if (habits.length > VISIBLE) {
        const noteY = HEADER_H + VISIBLE * ROW_H + 14
        ctx.fillStyle = "rgba(255,255,255,0.25)"
        ctx.font = "11px Georgia, serif"
        ctx.textAlign = "left"
        ctx.textBaseline = "alphabetic"
        ctx.fillText(`+${habits.length - VISIBLE} more habits`, 32, noteY)
    }

    ctx.fillStyle = "rgba(255,255,255,0.15)"
    ctx.font = "10px Georgia, serif"
    ctx.textAlign = "right"
    ctx.textBaseline = "alphabetic"
    ctx.fillText("habit tracker", W - 32, H - 12)
}

export default function StreakCard({ habits, onClose }) {
    const canvasRef = useRef(null)

    useEffect(() => {
        if (canvasRef.current) drawCard(canvasRef.current, habits)
    }, [habits])

    const download = () => {
        const link = document.createElement("a")
        link.download = "my-streak.png"
        link.href = canvasRef.current.toDataURL("image/png")
        link.click()
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div className="flex flex-col items-center gap-4 w-full max-w-lg">
                <div className="flex justify-between items-center w-full">
                    <p className="text-white text-sm opacity-50">your streak card</p>
                    <button onClick={onClose} className="text-white opacity-40 hover:opacity-80 text-xl leading-none">×</button>
                </div>

                <canvas
                    ref={canvasRef}
                    className="w-full rounded-2xl"
                    style={{ imageRendering: "crisp-edges" }}
                />

                <div className="flex gap-3 w-full">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl text-sm text-white/60 border border-white/10 hover:border-white/30 transition-colors"
                    >
                        close
                    </button>
                    <button
                        onClick={download}
                        className="flex-1 py-3 rounded-xl text-sm font-medium text-white"
                        style={{ background: "linear-gradient(135deg, #ffc488, #ff7979)" }}
                    >
                        download png 🗁
                    </button>
                </div>
            </div>
        </div>
    )
}