import { useState } from "react";

const ICONS = ["📚", "🏃", "💧", "🧘", "✍️", "🎸", "🥗", "😴", "🧹", "💻", "🌿", "🏋️"]
const COLORS = [
    "#aaacf7", "#70c8ab", "#e1b160", "#8fe579",
    "#9dc0f9", "#dda3fa", "#9ce292", "#71d3c8",
]

export default function HabitForm({ onAdd, onClose }) {
    const [name, setName] = useState("")
    const [icon, setIcon] = useState("📚")
    const [color, setColor] = useState("#aaacf7")

    const handleSubmit = () => {
        if(!name.trim()) return
        onAdd({ 
            name: name.trim(),
            icon,
            color
        })
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
            <div className="bg-orange-200 opacity-70 dark:bg-taupe-900 border border-orange-300 rounded-2xl w-full max-w-md p-6">
                <h2 className="text-orange-900 dark:text-orange-50 text-lg font-semibold mb-5">new habit</h2>

                <input
                    type="text"
                    placeholder="add a habit!"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                    className="text-black w-full bg-white dark:bg-orange-200 border border-amber-900 hover:border-amber-500 dark:hover:border-taupe-600 rounded-xl px-4 py-3 text-sm outline-none dark:focus:border-white transition-colors mb-5"
                    autoFocus
                />

                <div className="mb-5">
                    <p className="text-xs text-orange-900 dark:text-orange-100 dark:opacity-60 mb-2">icon</p>
                    <div className="flex flex-wrap gap-2">
                        {ICONS.map(i => (
                        <button
                            key={i}
                            onClick={() => setIcon(i)}
                            className={`w-10 h-10 rounded-xl text-xl transition-all ${
                            icon === i
                                ? "bg-amber-950 dark:bg-orange-300 scale-110"
                                : "bg-amber-900 dark:bg-orange-200 opacity-70 dark:hover:bg-taupe-500 hover:bg-amber-700 hover:opacity-80"
                            }`}
                        >
                            {i}
                        </button>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <p className="text-xs text-orange-900 dark:text-orange-100 dark:opacity-60 mb-2">color</p>
                    <div className="flex gap-2">
                        {COLORS.map(c => (
                        <button
                            key={c}
                            onClick={() => setColor(c)}
                            className="w-8 h-8 rounded-full transition-transform hover:scale-110"
                            style={{
                            background: c,
                            outline: color === c ? `3px solid ${c}` : "none",
                            outlineOffset: "2px",
                            }}
                        />
                        ))}
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl bg-amber-950 dark:bg-taupe-800 text-white hover:bg-amber-900 dark:hover:bg-taupe-600 transition-colors text-sm"
                    >
                        cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!name.trim()}
                        className="text-white flex-1 py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-30"
                        style={{ background: color }}
                    >
                        add habit
                    </button>
                </div>
            </div>
        </div>
    )
}
