import { useState } from "react";

const ICONS = ["📚", "🏃", "💧", "🧘", "✍️", "🎸", "🥗", "😴", "🧹", "💻", "🌿", "🏋️"]
const COLORS = [
    "#6366f1", "#10b981", "#f59e0b", "#ef4444",
    "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6",
]

export default function HabitForm({ onAdd, onClose }) {
    const [name, setName] = useState("")
    const [icon, setIcon] = useState("📚")
    const [color, setColor] = useState("#6366f1")

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
            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6">
                <h2 className="text-lg font-semibold mb-5">new habit</h2>

                <input
                    type="text"
                    placeholder="add a habit¡!"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-500 transition-colors mb-5"
                    autoFocus
                />

                <div className="mb-5">
                    <p className="text-xs text-gray-500 mb-2">icon</p>
                    <div className="flex flex-wrap gap-2">
                        {ICONS.map(i => (
                        <button
                            key={i}
                            onClick={() => setIcon(i)}
                            className={`w-10 h-10 rounded-xl text-xl transition-all ${
                            icon === i
                                ? "bg-gray-700 scale-110"
                                : "bg-gray-800 hover:bg-gray-700"
                            }`}
                        >
                            {i}
                        </button>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <p className="text-xs text-gray-500 mb-2">color</p>
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
                        className="flex-1 py-3 rounded-xl bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors text-sm"
                    >
                        cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!name.trim()}
                        className="flex-1 py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-30"
                        style={{ background: color }}
                    >
                        add habit
                    </button>
                </div>
            </div>
        </div>
    )
}