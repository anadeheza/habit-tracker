import { useState } from "react";

const ICONS = ["📚", "🏃", "💧", "🧘", "✍️", "🎸", "🥗", "😴", "🧹", "💻", "🌿", "🏋️"]
const COLORS = [
    "#aaacf7", "#70c8ab", "#e1b160", "#e57979",
    "#9dc0f9", "#dda3fa", "#e78fbb", "#71d3c8",
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
            <div className="bg-gray-900 border border-rose-300 rounded-2xl w-full max-w-md p-6">
                <h2 className="text-lg font-semibold mb-5">new habit</h2>

                <input
                    type="text"
                    placeholder="add a habit!"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                    className="text-black w-full bg-rose-200 border border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-100 transition-colors mb-5"
                    autoFocus
                />

                <div className="mb-5">
                    <p className="text-xs text-rose-100 opacity-60 mb-2">icon</p>
                    <div className="flex flex-wrap gap-2">
                        {ICONS.map(i => (
                        <button
                            key={i}
                            onClick={() => setIcon(i)}
                            className={`w-10 h-10 rounded-xl text-xl transition-all ${
                            icon === i
                                ? "bg-rose-400 scale-110"
                                : "bg-red-200 opacity-70 hover:bg-gray-700 hover:opacity-80"
                            }`}
                        >
                            {i}
                        </button>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <p className="text-xs text-rose-100 opacity-60 mb-2">color</p>
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
                        className="flex-1 py-3 rounded-xl bg-gray-800 text-rose-100 opacity-60 hover:bg-gray-700 transition-colors text-sm"
                    >
                        cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!name.trim()}
                        className="text-gray-300 flex-1 py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-30"
                        style={{ background: color }}
                    >
                        add habit
                    </button>
                </div>
            </div>
        </div>
    )
}