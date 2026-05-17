export function getStreak(completions) {
    if(!completions.length) return 0

    const sorted = [...completions].sort((a, b) => new Date(b) - new Date(a))
    const today = new Date().toISOString().split("T")[0]
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    if(sorted[0] !== today && sorted[0] !== yesterday) return 0 

    let streak = 1 
    for (let i = 1; i < sorted.length; i++) {
        const current = new Date(sorted[i - 1])
        const prev = new Date(sorted[i])
        const difference = (current - prev) / 86400000
        if(difference === 1) streak++
        else break
    }
    return streak
}

export function isCompletedToday(completions) {
    const today = new Date().toISOString().split("T")[0]
    return completions.includes(today)
}

export function getCompletionsRate(completions, days = 7) {
    const dates = Array.from({ length: days }, (_, i) => {
        const d = new Date(Date.now() - i * 86400000)
        return d.toISOString().split("T")[0]
    })

    const completed = dates.filter(d => completions.includes(d)).length
    
    return Math.round((completed / days) * 100)
}