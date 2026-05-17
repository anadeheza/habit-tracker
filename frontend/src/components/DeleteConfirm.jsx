export default function DeleteConfirm({ habit, onConfirm, onCancel }) {
    const streak = (() => {
        if (!habit.completions.length) return 0
        const sorted = [...habit.completions].sort((a, b) => new Date(b) - new Date(a))
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

    const hasStreak = streak > 0 

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
        >
            <div className="w-full max-w-sm rounded-2xl p-6 bg-taupe-700/60 border border-red-900">
                {/* Icon */}
                <div className="text-center mb-4">
                    <span className="text-4xl">{hasStreak ? "🥀" : "🗑️"}</span>
                </div>
 
                <h2 className="text-orange-200 text-center text-base font-semibold mb-2">
                    delete "{habit.name}"?
                </h2>
 
                {hasStreak ? (
                    <p className="text-center text-sm text-orange-200 opacity-70 mb-5">
                        wait, you have a <span className="font-semibold text-orange-300">{streak}-day streak</span> already! deleting this habit will kill your tree and you'll lose your progress
                        <p>this can't be undone!!⚠️</p>
                    </p>
                ) : (
                    <p className="text-center text-sm text-orange-200 opacity-70 mb-5">
                        this will permanently delete the habit and all its history.
                    </p>
                )}
 
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 rounded-xl text-sm font-medium bg-orange-600/30 text-orange-200 hover:bg-orange-900/70 transition-colors border border-orange-800/40"
                    >
                        keep it
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 rounded-xl text-sm font-medium bg-red-900/60 text-red-200 hover:bg-red-800 transition-colors border border-red-800/40"
                    >
                        {hasStreak ? "delete anyway" : "delete"}
                    </button>
                </div>
            </div>
        </div>
    )
}