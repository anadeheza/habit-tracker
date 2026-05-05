const treeStage = (streak) => {
    if (streak === 0) return 0 
    if (streak < 4)   return 1
    if (streak < 7)   return 2
    if (streak < 14)  return 3 
    if (streak < 30)  return 4 
    if (streak < 60)  return 5 
    return 6 
}

const stageLabel = [
    "seed 🌰", 
    "sprout 🌱", 
    "seedling 🌿", 
    "sapling 🪴", 
    "young tree 🌲", 
    "blooming 🌸", 
    "ancient 🌳"
]

function TreeSVG({ streak, color }) {
    const stage = treeStage(streak)
    const w = 220
    const h = 220 

    const trunkH = [12, 22, 38, 55, 75, 85, 92][stage]
    const trunkW = [4, 5, 7, 9, 11, 12, 14][stage]
    const levels = [0, 1, 2, 3, 4, 5, 5][stage]
    const leafSize = [0, 0, 5, 7, 9, 11, 13][stage]
    const bloomCount = [0, 0, 0, 0, 3, 8, 14][stage]

    const cx = w / 2
    const baseY = h - 18

    const branches = []
    let branchId = 0 

    function addBranch(x, y, angle, length, depth) {
        if (depth === 0 || length < 5) return 
        const rad = (angle * Math.PI) / 180 
        const ex = x + Math.cos(rad) * length
        const ey = y - Math.sin(rad) * length
        branches.push({ 
            x1: x,
            y1: y,
            x2: ex,
            y2: ey,
            depth,
            id: branchId++
        })
        const spread = 28 + depth * 4
        addBranch(ex, ey, angle + spread, length * 0.68, depth - 1)
        addBranch(ex, ey, angle - spread, length * 0.68, depth - 1)
    }

    if(levels > 0) {
        addBranch(cx, baseY - trunkH, 90, trunkH * 0.55, levels)
    }

    const tips = branches.filter(b => {
        return !branches.some(o => o.x1 === b.x2 && o.y1 === b.y2)
    })

    const blooms = []
    if(bloomCount > 0) {
        tips.forEach((t, i) => {
            if(i % Math.max(1, Math.ceil(tips.length / bloomCount)) === 0) {
                blooms.push({
                    x: t.x2,
                    y: t.y2 
                })
            }
        })
    }

    const strokeColor = color
    const leafColor = stage >= 5 ? "#5DCAA5" : stage >= 3 ? "#7fc47a" : "#9fe88a"
    const bloomColor = stage >= 6 ? "#e78fbb" : "#f5c4d1"
    const trunkColor = stage <= 1 ? "#9FE1CB" : "#b5935a"

    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
            {/* Ground */}
            <ellipse cx={cx} cy={baseY + 8} rx={trunkW * 3} ry={5}
                fill={trunkColor} opacity={0.25} />
 
            {/* Trunk */}
            {stage >= 1 && (
                <rect
                    x={cx - trunkW / 2} y={baseY - trunkH}
                    width={trunkW} height={trunkH + 6}
                    rx={trunkW / 2}
                    fill={trunkColor}
                />
            )}
 
            {/* Seed */}
            {stage === 0 && (
                <ellipse cx={cx} cy={baseY} rx={9} ry={7} fill={color} opacity={0.7} />
            )}
 
            {/* Sprout stage 1 */}
            {stage === 1 && (
                <ellipse cx={cx} cy={baseY - trunkH - 4} rx={8} ry={6} fill={leafColor} opacity={0.9} />
            )}
 
            {/* Branches */}
            {branches.map(b => (
                <line key={b.id}
                    x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2}
                    stroke={trunkColor}
                    strokeWidth={Math.max(1, b.depth * 1.5)}
                    strokeLinecap="round"
                />
            ))}
 
            {/* Leaf clusters at tips */}
            {leafSize > 0 && tips.map((t, i) => (
                <circle key={i}
                    cx={t.x2} cy={t.y2} r={leafSize + (i % 3)}
                    fill={leafColor} opacity={0.82}
                />
            ))}
 
            {/* Blooms */}
            {blooms.map((b, i) => (
                <circle key={i}
                    cx={b.x} cy={b.y} r={5}
                    fill={bloomColor} opacity={0.9}
                />
            ))}
 
            {/* Canopy for larger stages (filled circle behind branches) */}
            {stage >= 4 && tips.length > 2 && (() => {
                const xs = tips.map(t => t.x2)
                const ys = tips.map(t => t.y2)
                const midX = (Math.min(...xs) + Math.max(...xs)) / 2
                const midY = (Math.min(...ys) + Math.max(...ys)) / 2
                const rx = (Math.max(...xs) - Math.min(...xs)) / 2 + leafSize
                const ry = (Math.max(...ys) - Math.min(...ys)) / 2 + leafSize
                return (
                    <ellipse cx={midX} cy={midY} rx={rx} ry={ry}
                        fill={leafColor} opacity={0.18} />
                )
            })()}
        </svg>
    )
}
 
export default function HabitTree({ habit, onClose }) {
    const { completions, color, name, icon } = habit
    const streak = (() => {
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
    })()
 
    const stage = treeStage(streak)
    const label = stageLabel[stage]
    const nextAt = [1, 4, 7, 14, 30, 60, null][stage]
    const daysToNext = nextAt ? nextAt - streak : null
 
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
        >
            <div
                className="w-full max-w-xs rounded-3xl p-6 relative"
                style={{
                    background: "linear-gradient(160deg, #1a1208 0%, #0d1a12 100%)",
                    border: `1px solid ${color}33`,
                    boxShadow: `0 0 60px ${color}22`,
                }}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white opacity-40 hover:opacity-80 transition-opacity text-xl leading-none"
                >
                    ×
                </button>
 
                {/* Header */}
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{icon}</span>
                    <p className="text-sm font-medium" style={{ color }}>{name}</p>
                </div>
                <p className="text-xs opacity-40 text-white mb-5">your living tree</p>
 
                {/* Tree */}
                <div className="flex justify-center mb-3">
                    <TreeSVG streak={streak} color={color} />
                </div>
 
                {/* Stage label */}
                <div className="text-center mb-4">
                    <p className="text-base font-semibold text-white">{label}</p>
                    <p className="text-xs opacity-50 text-white mt-1">
                        {streak === 0
                            ? "start your streak to plant the seed"
                            : `${streak}-day streak`}
                    </p>
                </div>
 
                {/* Progress to next stage */}
                {daysToNext !== null && streak > 0 && (
                    <div className="mt-2">
                        <div className="flex justify-between text-xs opacity-50 text-white mb-1">
                            <span>next stage</span>
                            <span>{daysToNext} day{daysToNext !== 1 ? "s" : ""} away</span>
                        </div>
                        <div className="h-1.5 rounded-full w-full" style={{ background: "#ffffff15" }}>
                            <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                    background: color,
                                    width: `${Math.round((1 - daysToNext / nextAt) * 100)}%`,
                                }}
                            />
                        </div>
                    </div>
                )}
 
                {stage === 6 && (
                    <p className="text-center text-xs mt-3" style={{ color }}>
                        🏆 ancient tree achieved. you're a legend.
                    </p>
                )}
 
                <button
                    onClick={onClose}
                    className="mt-5 w-full py-2.5 rounded-xl text-sm font-medium transition-colors"
                    style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
                >
                    close
                </button>
            </div>
        </div>
    )
}