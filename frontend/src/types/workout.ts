export type WorkoutType = 'RUN' | 'SWIM' | 'GYM' | 'HYROX'

// Respuesta del GET /{id} - Detalle completo
export type WorkoutDetailResponse = {
    id: number
    userId: number
    type: WorkoutType
    startDateTime: string
    endDateTime: string | null
    globalRpe: number | null
    notes: string | null
    location: string | null
    source: string | null
    hyroxDetailsId: number | null
    runDetailsId: number | null
    swimDetailsId: number | null
    gymDetailsId: number | null
}

// Respuesta del GET (listado) - Resumen
export type WorkoutSummaryResponse = {
    id: number
    type: WorkoutType
    startDateTime: string
    endDateTime: string | null
    globalRpe: number | null
    location: string | null
}

// Request para POST
export type WorkoutCreateRequest = {
    type: WorkoutType
    startDateTime: string
    endDateTime?: string | null
    globalRpe?: number | null
    notes?: string | null
    location?: string | null
    source?: string | null
}

// Request para PATCH
export type WorkoutUpdateRequest = {
    type?: WorkoutType
    startDateTime?: string
    endDateTime?: string | null
    globalRpe?: number | null
    notes?: string | null
    location?: string | null
    source?: string | null
}