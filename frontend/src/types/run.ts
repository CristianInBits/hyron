import type { ShoeSummaryResponse } from './shoe'

export type RunIntervalType = 'WARMUP' | 'WORK' | 'REST' | 'COOLDOWN' | 'OTHER'

export type RunDetailsResponse = {
    id: number
    workoutId: number
    totalDistanceMeters: number | null
    totalDurationSeconds: number | null
    totalElevationGain: number | null
    averageHr: number | null
    shoe: ShoeSummaryResponse | null
    notes: string | null
    averagePaceSecondsPerKm: number | null
    intervals: RunIntervalResponse[]
}

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

export type RunDetailsCreateRequest = {
    totalDistanceMeters?: number | null
    totalElevationGain?: number | null
    averageHr?: number | null
    shoeId?: number | null
    notes?: string | null
    intervals: RunIntervalRequest[]
}

export type RunIntervalRequest = {
    type: RunIntervalType
    durationSeconds: number
    distanceMeters?: number | null
    averageHr?: number | null
    cadenceSpm?: number | null
    elevationGain?: number | null
    notes?: string | null
}

export const runIntervalTypeLabels: Record<RunIntervalType, string> = {
    WARMUP: 'Calentamiento',
    WORK: 'Trabajo',
    REST: 'Descanso',
    COOLDOWN: 'Vuelta a la calma',
    OTHER: 'Otro',
}