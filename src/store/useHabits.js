import { useState, useEffect } from "react";

const STORAGE_KEY = "habit-tracker-data"

const defaultHabits = [
    {
        id: "1",
        name: "Read 30 min",
        icon: "📚",
        color: "#6366f1",
        completions: [],
        createdAt: new Date().toISOString(),
    },
    {
        id: "2",
        name: "Exercise",
        icon: "🏃",
        color: "#10b981",
        completions: [],
        createdAt: new Date().toISOString(),
    },
]

export function useHabits() {
    const [habits, setHabits] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : defaultHabits
    })

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
    }, [habits])

    const toggleToday = (id) => {
        const today = new Date().toISOString().split("T")[0]
        setHabits(prev => 
            prev.map(h => 
                h.id === id ? {
                    ...h,
                    completions: h.completions.includes(today) 
                    ? h.completions.filter(d => d !== today)
                    :[...h.completions, today],
                }
                : h
            )
        )
    }

    const addHabit = (habit) => {
        setHabits(prev => [...prev, { 
            ...habit, 
            id: crypto.randomUUID(), 
            completions: [], 
            createdAt: new Date().toISOString()
        }])
    }

    const deleteHabit = (id) => {
        setHabits(prev => prev.filter(h => h.id !== id))
    }

    return { habits, toggleToday, addHabit, deleteHabit }
}