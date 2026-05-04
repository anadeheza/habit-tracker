import HabitCard from "./HabitCard";

export default function HabitList({ habits, onToggle, onDelete}) {
    if(!habits.length) {
        return (
            <div className="text-center text-gray-600 py-16">
                <p className="text-4xl mb-3">🌱</p>
                <p>no habits yet — add one below</p>
            </div>
        )
    }

    return (
        <div>
            {habits.map(h => (
                <HabitCard key={h.id} habit={h} onToggle={onToggle} onDelete={onDelete} />
            ))}
        </div>
    )
}