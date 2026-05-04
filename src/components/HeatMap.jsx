export default function HeatMap ({ completions, color }) {
    const WEEKS = 18 
    const days = WEEKS * 7

    const cells = Array.from({ length: days }, (_, i) => {
        const date = new Date(Date.now() - (days - 1 - i) * 86400000)
        const key = date.toISOString().split("T")[0]
        const done = completions.includes(key)
        const isToday = key === new Date().toISOString().split("T")[0]
        return { key, done, isToday }
    })

    return (
        <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">last {WEEKS} weeks</p>
            
            <div
                className="grid gap-1"
                style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }}
            >
                {Array.from({ length: WEEKS }, (_, col) =>
                    Array.from({ length: 7 }, (_, row) => {
                        const cell = cells[col * 7 + row]
                        return (
                            <div
                                key={cell.key}
                                title={cell.key}
                                className="aspect-square rounded-sm transition-all"
                                style={{
                                    background: cell.done ? color : "#1f2937",
                                    opacity: cell.done ? 1 : 1,
                                    outline: cell.isToday ? `1px solid ${color}` : "none",
                                    outlineOffset: "1px",
                                }}
                            />
                        )
                    })
                )}
            </div>
        </div>
    )
}