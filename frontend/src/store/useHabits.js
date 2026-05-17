import { useState, useEffect } from "react";

const API_URL = "http://localhost:3000/api/habits";

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
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true); // Útil para mostrar un spinner mientras carga

    // 1. CARGAR DATOS DESDE EL BACKEND AL INICIAR
    useEffect(() => {
        async function fetchHabits() {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();
                setHabits(data);
            } catch (error) {
                console.error("Error cargando hábitos desde el servidor:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchHabits();
    }, []);

    // 2. MARCAR / DESMARCAR COMPLETADO HOY
    const toggleToday = async (id) => {
        const today = new Date().toISOString().split("T")[0];
        
        // Buscamos el hábito actual localmente para saber su estado previo
        const targetHabit = habits.find(h => h.id === id);
        if (!targetHabit) return;

        // Calculamos el nuevo array de completions
        const updatedCompletions = targetHabit.completions.includes(today)
            ? targetHabit.completions.filter(d => d !== today)
            : [...targetHabit.completions, today];

        try {
            // Enviamos la actualización al backend
            const response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completions: updatedCompletions })
            });
            const updatedHabitFromBackend = await response.json();

            // Sincronizamos el estado de React en pantalla
            setHabits(prev => prev.map(h => h.id === id ? updatedHabitFromBackend : h));
        } catch (error) {
            console.error("No se pudo actualizar el hábito:", error);
        }
    };

    // 3. AGREGAR HÁBITO EN LA BASE DE DATOS
    const addHabit = async (habit) => {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(habit) // Enviamos name, icon y color
            });
            const newHabitFromBackend = await response.json();
            
            // Añadimos el nuevo hábito devuelto por el backend (con su ID real) al estado
            setHabits(prev => [...prev, newHabitFromBackend]);
        } catch (error) {
            console.error("Error al crear el hábito:", error);
        }
    };

    // 4. ELIMINAR HÁBITO DE LA BASE DE DATOS
    const deleteHabit = async (id) => {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });
            // Si el backend lo borró con éxito, lo quitamos de la pantalla
            setHabits(prev => prev.filter(h => h.id !== id));
        } catch (error) {
            console.error("No se pudo eliminar el hábito:", error);
        }
    };

    // 5. REORDENAR (Nota: Se queda temporalmente en memoria local 
    // a menos que añadas una columna 'order' en tu base de datos)
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