export default function VibeCard({ completed, total }) {
    if (total === 0) return null

    const pct = total === 0 ? 0 : Math.round((completed / total) * 100)

    const vibe = (() => {
        if(pct === 100) return {
            emoji: "🔥", 
            title: "all done!", 
            color: "#10b981",
            msg: "you made it! ( ◡̀_◡́)ᕤ"
        }
        if (pct >= 75) return {
            emoji: "🔜", title: "almost there!", color: "#6366f1",
            msg: `${completed} of ${total} done.`
        }
        if (pct >= 40) return {
            emoji: "☕", title: "halfway there, keep going!", color: "#e1b160",
            msg: `${completed} of ${total} done.`
        }
        if (pct > 0) return {
            emoji: "💪🏻", title: "gettin' started, let's go!", color: "#e57979",
            msg: `${completed} of ${total} done.`
        }
        return {
            emoji: "💛", title: "start now, feel better later", color: "#aaacf7",
            msg: `${completed} of ${total} done.`
        }
    })()

    const circum = 2 * Math.PI * 16
    const offset = circum - (pct / 100) * circum

    return (
        <div
            className="mb-6 rounded-2xl p-4 flex items-center gap-4 border border-orange-900/30"
            style={{ background: "rgba(28, 14, 4, 0.71)" }}
        >
            <span className="text-3xl shrink-0">{vibe.emoji}</span>
 
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{vibe.title}</p>
                <p className="text-xs text-orange-200 opacity-60 mt-0.5 truncate">{vibe.msg}</p>
                <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: vibe.color }}
                    />
                </div>
            </div>
 
            {/* Ring */}
            <svg width="40" height="40" viewBox="0 0 40 40" className="shrink-0 -rotate-90">
                <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3.5" />
                <circle
                    cx="20" cy="20" r="16" fill="none"
                    stroke={vibe.color} strokeWidth="3.5"
                    strokeDasharray={circum}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.7s ease" }}
                />
                <text
                    x="20" y="20"
                    textAnchor="middle" dominantBaseline="central"
                    fontSize="9" fontWeight="600" fill="white"
                    style={{ transform: "rotate(90deg)", transformOrigin: "20px 20px" }}
                >
                    {pct}%
                </text>
            </svg>
        </div>
    )
}