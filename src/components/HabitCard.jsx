import { getStreak, isCompletedToday, getCompletionsRate } from "../utilities/streaks";

const streakMessage = (n) => {
    if (n === 0) return "no streak... yet, start now! ;)"
    if (n === 1) return "gettin' started!!"
    if(n < 5) return `${n} days, ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧`
    if (n < 14) return `${n} days, let's go! ᕙ(  •̀ ᗜ •́  )ᕗ `
    if (n < 30) return `${n} days already? amazing!🔥💯`
    return `${n} days! complete legend 🐦‍🔥🏆`
}

export default function HabitCard({ habit, onToggle, onDelete }) {
    const done = isCompletedToday(habit.completions)
    const streak = getStreak(habit.completions)
    const rate = getCompletionsRate(habit.completions, 7)

    return (
        <div
            className={`rounded-2xl p-4 mb-3 transition-all duration-300 border ${
                done
                ? "bg-gray-800 border-gray-700 opacity-75"
                : "bg-gray-900 border-gray-800 hover:border-gray-600"
            }`}
        >
            <div className="flex items-center gap-4">
                <button
                    onClick={() => onToggle(habit.id)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl transition-transform active:scale-90"
                    style={{
                        background: done ? habit.color : "transparent",
                        border: `2px solid ${habit.color}`,
                    }}
                >
                    {done ? "✓" : habit.icon}
                </button>

                <div className="flex-1">
                    <p className={`font-medium ${done ? "line-through text-gray-500" : ""}`}>
                        {habit.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{streakMessage(streak)}</p>
                </div>

                <div className="text-right">
                    <p className="text-sm font-medium" style={{ color: habit.color }}>
                        {rate}%
                    </p>
                    <p className="text-xs text-gray-600">7-day</p>
                </div>

                <button
                    onClick={() => onDelete(habit.id)}
                    className="text-gray-700 hover:text-red-500 transition-colors text-lg ml-1"
                    >
                    ×
                </button>
            </div>
        </div>
    )
}