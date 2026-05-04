import { useState } from 'react'
import { useHabits } from './store/useHabits'
import HabitList from "./components/HabitList"
import HabitForm from "./components/HabitForm"

export default function App() {
  const { habits, toggleToday, addHabit, deleteHabit } = useHabits()
  const [showForm, setShowForm] = useState(false)

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric"
  })

  const completedToday = habits.filter(h => 
    h.completions.includes(new Date().toISOString().split("T")[0])
  ).length

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 max-w-2xl mx-auto">
      <header className="mb-8">
        <p className="text-gray-500 text-sm">{today}</p>
        <h1 className="text-3xl font-bold mt-1">Your habits</h1>
        <p className="text-gray-400 mt-1">
          {completedToday} of {habits.length} done today
          {completedToday === habits.length && habits.length > 0 && " 🔥"}
        </p>
      </header>

      <HabitList
        habits={habits}
        onToggle={toggleToday}
        onDelete={deleteHabit}
      />

      <button
        onClick={() => setShowForm(true)}
        className="mt-6 w-full py-3 rounded-xl border border-dashed border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300 transition-colors"
      >
        + add habit
      </button>

      {showForm && (
        <HabitForm
          onAdd={(h) => { addHabit(h); setShowForm(false) }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

