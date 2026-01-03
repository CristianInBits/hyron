export type HyroxStation =
    | 'RUN'
    | 'SKI_ERG'
    | 'SLED_PUSH'
    | 'SLED_PULL'
    | 'BURPEE_BROAD_JUMP'
    | 'ROW'
    | 'FARMERS_CARRY'
    | 'SANDBAG_LUNGES'
    | 'WALL_BALLS'
    | 'OTHER'

// Response del detalle completo
export type HyroxDetailsResponse = {
    id: number
    workoutId: number
    notes: string | null
    blocks: HyroxBlockResponse[]
}

// Response de cada bloque
export type HyroxBlockResponse = {
    id: number
    orderIndex: number
    restDurationSeconds: number | null
    notes: string | null
    items: HyroxItemResponse[]
}

// Response de cada item/estación
export type HyroxItemResponse = {
    id: number
    orderIndex: number
    station: HyroxStation
    durationSeconds: number
    recoveryDurationSeconds: number | null
    distanceMeters: number | null
    reps: number | null
    weightKg: number | null
    averageHr: number | null
    rpe: number | null
    notes: string | null
    paceSecondsPerKm: number | null
}

// Request para crear/actualizar detalles
export type HyroxDetailsCreateRequest = {
    notes?: string | null
    blocks: HyroxBlockRequest[]
}

// Request de cada bloque
export type HyroxBlockRequest = {
    restDurationSeconds?: number | null
    notes?: string | null
    items: HyroxItemRequest[]
}

// Request de cada item/estación
export type HyroxItemRequest = {
    station: HyroxStation
    durationSeconds: number
    recoveryDurationSeconds?: number | null
    distanceMeters?: number | null
    reps?: number | null
    weightKg?: number | null
    averageHr?: number | null
    rpe?: number | null
    notes?: string | null
}

// Labels en español
export const hyroxStationLabels: Record<HyroxStation, string> = {
    RUN: 'Carrera',
    SKI_ERG: 'Ski Erg',
    SLED_PUSH: 'Sled Push',
    SLED_PULL: 'Sled Pull',
    BURPEE_BROAD_JUMP: 'Burpee Broad Jump',
    ROW: 'Remo',
    FARMERS_CARRY: 'Farmers Carry',
    SANDBAG_LUNGES: 'Sandbag Lunges',
    WALL_BALLS: 'Wall Balls',
    OTHER: 'Otro',
}

// Iconos/emojis para cada estación
export const hyroxStationIcons: Record<HyroxStation, string> = {
    RUN: '🏃',
    SKI_ERG: '⛷️',
    SLED_PUSH: '🛷',
    SLED_PULL: '🪢',
    BURPEE_BROAD_JUMP: '🦘',
    ROW: '🚣',
    FARMERS_CARRY: '🧺',
    SANDBAG_LUNGES: '🎒',
    WALL_BALLS: '🏐',
    OTHER: '❓',
}

// Estaciones que requieren distancia
export const distanceStations: HyroxStation[] = [
    'RUN', 'SKI_ERG', 'ROW', 'SLED_PUSH', 'SLED_PULL',
    'FARMERS_CARRY', 'SANDBAG_LUNGES', 'BURPEE_BROAD_JUMP'
]

// Estaciones que requieren peso
export const weightedStations: HyroxStation[] = [
    'SLED_PUSH', 'SLED_PULL', 'FARMERS_CARRY', 'SANDBAG_LUNGES', 'WALL_BALLS'
]

// Helper para saber si requiere distancia
export const requiresDistance = (station: HyroxStation): boolean =>
    distanceStations.includes(station)

// Helper para saber si requiere peso
export const requiresWeight = (station: HyroxStation): boolean =>
    weightedStations.includes(station)

// Helper para saber si requiere reps (solo WALL_BALLS)
export const requiresReps = (station: HyroxStation): boolean =>
    station === 'WALL_BALLS'