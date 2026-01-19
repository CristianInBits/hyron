export const FEELINGS = [
    { value: 5, emoji: '😫', label: 'Muy duro' },
    { value: 4, emoji: '😓', label: 'Duro' },
    { value: 3, emoji: '😊', label: 'Normal' },
    { value: 2, emoji: '😄', label: 'Bien' },
    { value: 1, emoji: '🤩', label: 'Genial' },
] as const

// Helper para obtener el label rápido
export const getFeelingLabel = (value: number | null) => {
    if (!value) return null
    return FEELINGS.find(f => f.value === value)?.label || null
}