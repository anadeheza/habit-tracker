import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

const API_URL = "https://habit-tracker-production-92f5.up.railway.app/api/habits";

export function useHabits() {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getToken, isLoaded, isSignedIn } = useAuth();

    async function authFetch(url, options = {}) {
        const token = await getToken();
        return fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...options.headers,
            }
        });
    }

    useEffect(() => {
        if (!isLoaded || !isSignedIn) return;

        async function fetchHabits() {
            try {
                const res = await authFetch(API_URL);
                const data = await res.json();
                setHabits(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error cargando hábitos:", error);
                setHabits([]);
            } finally {
                setLoading(false);
            }
        }
        fetchHabits();
    }, [isLoaded, isSignedIn]);

    const toggleToday = async (id) => {
        const today = new Date().toISOString().split("T")[0];
        const targetHabit = habits.find(h => h.id === id);
        if (!targetHabit) return;

        const updatedCompletions = targetHabit.completions.includes(today)
            ? targetHabit.completions.filter(d => d !== today)
            : [...targetHabit.completions, today];

        try {
            const res = await authFetch(`${API_URL}/${id}`, {
                method: "PUT",
                body: JSON.stringify({ completions: updatedCompletions })
            });
            const updated = await res.json();
            setHabits(prev => prev.map(h => h.id === id ? updated : h));
        } catch (error) {
            console.error("No se pudo actualizar:", error);
        }
    };

    const addHabit = async (habit) => {
        try {
            const res = await authFetch(API_URL, {
                method: "POST",
                body: JSON.stringify(habit)
            });
            const newHabit = await res.json();
            setHabits(prev => [...prev, newHabit]);
        } catch (error) {
            console.error("Error al crear:", error);
        }
    };

    const deleteHabit = async (id) => {
        try {
            await authFetch(`${API_URL}/${id}`, { method: "DELETE" });
            setHabits(prev => prev.filter(h => h.id !== id));
        } catch (error) {
            console.error("No se pudo eliminar:", error);
        }
    };

    const reorderHabits = (fromIndex, toIndex) => {
        setHabits(prev => {
            const next = [...prev];
            const [moved] = next.splice(fromIndex, 1);
            next.splice(toIndex, 0, moved);
            return next;
        });
    };

    return { habits, loading, toggleToday, addHabit, deleteHabit, reorderHabits };
}