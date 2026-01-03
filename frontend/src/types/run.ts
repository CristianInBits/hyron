import type { ShoeSummaryResponse } from './shoe'

export type RunIntervalType = 'WARMUP' | 'WORK' | 'REST' | 'COOLDOWN' | 'OTHER'

// Response del detalle completo
export type RunDetailsResponse = {
    id: number
    workoutId: number
    totalDistanceMeters: number | null
    totalElevationGain: number | null
    averageHr: number | null
    shoe: ShoeSummaryResponse | null
    notes: string | null
    averagePaceSecondsPerKm: number | null
    intervals: RunIntervalResponse[]
}

// Response de cada intervalo
export type RunIntervalResponse = {
    id: number
    orderIndex: number
    type: RunIntervalType
    durationSeconds: number
    distanceMeters: number | null
    averageHr: number | null
    cadenceSpm: number | null
    elevationGain: number | null
    notes: string | null
    paceSecondsPerKm: number | null
}

// Request para crear/actualizar detalles
export type RunDetailsCreateRequest = {
    totalDistanceMeters?: number | null
    totalElevationGain?: number | null
    averageHr?: number | null
    shoeId?: number | null
    notes?: string | null
    intervals: RunIntervalRequest[]
}

// Request de cada intervalo
export type RunIntervalRequest = {
    type: RunIntervalType
    durationSeconds: number
    distanceMeters?: number | null
    averageHr?: number | null
    cadenceSpm?: number | null
    elevationGain?: number | null
    notes?: string | null
}

// Labels en español
export const runIntervalTypeLabels: Record<RunIntervalType, string> = {
    WARMUP: 'Calentamiento',
    WORK: 'Trabajo',
    REST: 'Descanso',
    COOLDOWN: 'Vuelta a la calma',
    OTHER: 'Otro',
}