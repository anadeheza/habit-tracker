import { useState, useEffect, useRef } from 'react'
import { useHabits } from './store/useHabits'
import HabitList from "./components/HabitList"
import HabitForm from "./components/HabitForm"
import VibeCard from "./components/VibeCard"
import StreakCard from "./components/StreakCard"
import Confetti from "./components/Confetti"
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'

export default function App() {
  const { habits, toggleToday, addHabit, deleteHabit, reorderHabits } = useHabits()
  const [showForm, setShowForm] = useState(false)
  const [showStreakCard, setShowStreakCard] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const prevAllDoneRef = useRef(false)

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric"
  })

  const todayKey = new Date().toISOString().split("T")[0]
  const completedToday = habits.filter(h => Array.isArray(h.completions) && h.completions.includes(todayKey)).length  
  const allDone = habits.length > 0 && completedToday === habits.length

  useEffect(() => {
    if (allDone && !prevAllDoneRef.current) {
      setConfetti(true)
      const t = setTimeout(() => setConfetti(false), 4000)
      return () => clearTimeout(t)
    }
    prevAllDoneRef.current = allDone
  }, [allDone])

  return (
    <>
      <SignedOut>
          <div className="min-h-screen bg-orange-100 flex flex-col items-center justify-center gap-4">
            <h1 className="text-3xl font-bold text-amber-800">Your habits</h1>
            <p className="text-orange-900 opacity-70">Sign in to track your habits</p>
            <SignInButton mode="modal">
              <button className="px-6 py-2 rounded-xl bg-orange-700 text-white hover:bg-orange-600 transition-colors">
                Sign in
              </button>
            </SignInButton>
          </div>
        </SignedOut>

      <SignedIn>
        <div className="min-h-screen bg-orange-100 dark:bg-taupe-800 text-gray-100 p-6 max-w-2xl mx-auto">
          <Confetti trigger={confetti} />

          <header className="mb-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-orange-900 dark:text-orange-200 opacity-70 text-sm">{today}</p>
                <h1 className="text-3xl font-bold mt-1 text-amber-800 dark:text-orange-300">Your habits</h1>
                <p className="text-orange-900 dark:text-orange-200 opacity-60 mt-1">
                  {completedToday} of {habits.length} done today
                  {allDone && " 🔥"}
                </p>
              </div>

              {/* Streak card button */}
              {habits.length > 0 && (
                <button
                  onClick={() => setShowStreakCard(true)}
                  className="mt-1 px-3 py-1.5 rounded-xl text-xs font-medium border border-orange-700/40 text-orange-800 dark:text-orange-300 hover:border-orange-500 dark:hover:border-orange-400 transition-colors opacity-70 hover:opacity-100"
                >
                  share streak :) 
                </button>
              )}
            </div>
          </header>

          {/* Today's vibe */}
          <VibeCard completed={completedToday} total={habits.length} />

          <HabitList
            habits={habits}
            onToggle={toggleToday}
            onDelete={deleteHabit}
            onReorder={reorderHabits}
          />

          <button
            onClick={() => setShowForm(true)}
            className="mt-6 w-full py-3 rounded-xl border border-dashed border-orange-700 dark:border-orange-600 opacity-40 text-orange-700 dark:text-orange-400 hover:opacity-100 dark:hover:opacity-100 dark:hover:text-orange-300 dark:hover:border-orange-400 transition-colors"
          >
            + add habit
          </button>

          {showForm && (
            <HabitForm
              onAdd={(h) => { addHabit(h); setShowForm(false) }}
              onClose={() => setShowForm(false)}
            />
          )}

          {showStreakCard && (
            <StreakCard habits={habits} onClose={() => setShowStreakCard(false)} />
          )}
        </div>
      </SignedIn>
    </>
  )
}