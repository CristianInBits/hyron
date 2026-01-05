import type { ShoeSummaryResponse } from './shoe'

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

export type HyroxDetailsResponse = {
    id: number
    workoutId: number
    shoe: ShoeSummaryResponse | null
    notes: string | null
    blocks: HyroxBlockResponse[]
}

export type HyroxBlockResponse = {
    id: number
    orderIndex: number
    restDurationSeconds: number | null
    notes: string | null
    items: HyroxItemResponse[]
}

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

export type HyroxDetailsCreateRequest = {
    shoeId?: number | null
    notes?: string | null
    blocks: HyroxBlockRequest[]
}

export type HyroxBlockRequest = {
    restDurationSeconds?: number | null
    notes?: string | null
    items: HyroxItemRequest[]
}

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

export const distanceStations: HyroxStation[] = [
    'RUN', 'SKI_ERG', 'ROW', 'SLED_PUSH', 'SLED_PULL',
    'FARMERS_CARRY', 'SANDBAG_LUNGES', 'BURPEE_BROAD_JUMP'
]

export const weightedStations: HyroxStation[] = [
    'SLED_PUSH', 'SLED_PULL', 'FARMERS_CARRY', 'SANDBAG_LUNGES', 'WALL_BALLS'
]

export const requiresDistance = (station: HyroxStation): boolean =>
    distanceStations.includes(station)

export const requiresWeight = (station: HyroxStation): boolean =>
    weightedStations.includes(station)

export const requiresReps = (station: HyroxStation): boolean =>
    station === 'WALL_BALLS'