import { useState, useRef } from "react";
import HabitCard from "./HabitCard";
import HabitTree from "./HabitTree"
import DeleteConfirm from "./DeleteConfirm"

export default function HabitList({ habits, onToggle, onDelete, onReorder}) {
    const [dragIndex, setDragIndex] = useState(null)
    const [overIndex, setOverIndex] = useState(null)
    const [treeHabit, setTreeHabit] = useState(null)
    const [deleteHabit, setDeleteHabit] = useState(null)
    const dragNode = useRef(null)

    if(!habits.length) {
        return (
            <div className="text-center text-amber-900 dark:text-gray-400 py-16">
                <p className="text-4xl mb-3">🌱</p>
                <p>no habits yet -- add one below!</p>
            </div>
        )
    }

    const handleDragStart = (e, index) => {
        setDragIndex(index)
        dragNode.current = e.currentTarget 

        setTimeout(() => {
            if(dragNode.current) dragNode.current.style.opacity = "0.4"
        }, 0)
    }

    const handleDragEnter = (e, index) => {
        if(index !== dragIndex) setOverIndex(index)
    }

    const handleDragEnd = () => {
        if(dragNode.current) dragNode.current.style.opacity = "1"
        if(dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
            onReorder(dragIndex, overIndex)
        } 

        setDragIndex(null)
        setOverIndex(null)
        dragNode.current = null
    }


    return (
        <>
            <div>
                {habits.map((h, i) => (
                    <div
                        key={h.id}
                        draggable
                        onDragStart={e => handleDragStart(e, i)}
                        onDragEnter={e => handleDragEnter(e, i)}
                        onDragOver={e => e.preventDefault()}
                        onDragEnd={handleDragEnd}
                        className="transition-transform duration-150"
                        style={{
                            transform: overIndex === i && dragIndex !== i
                                ? dragIndex < i ? "translateY(6px)" : "translateY(-6px)"
                                : "translateY(0)",
                            cursor: "grab",
                        }}
                    >
                        <HabitCard
                            habit={h}
                            onToggle={onToggle}
                            onTreeRequest={setTreeHabit}
                            onDeleteRequest={setDeleteHabit}
                        />
                    </div>
                ))}
            </div>
 
            {/* Modals rendered outside drag wrappers — safe for position:fixed */}
            {treeHabit && (
                <HabitTree
                    habit={treeHabit}
                    onClose={() => setTreeHabit(null)}
                />
            )}
 
            {deleteHabit && (
                <DeleteConfirm
                    habit={deleteHabit}
                    onConfirm={() => {
                        onDelete(deleteHabit.id)
                        setDeleteHabit(null)
                    }}
                    onCancel={() => setDeleteHabit(null)}
                />
            )}
        </>
    )
}