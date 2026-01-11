export type WorkoutType = 'RUN' | 'SWIM' | 'GYM' | 'HYROX'

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

export type WorkoutSummaryResponse = {
    id: number
    type: WorkoutType
    startDateTime: string
    endDateTime: string | null
    globalRpe: number | null
    location: string | null
}

export type WorkoutCreateRequest = {
    type: WorkoutType
    startDateTime: string
    endDateTime?: string | null
    globalRpe?: number | null
    notes?: string | null
    location?: string | null
    source?: string | null
}

export type WorkoutUpdateRequest = {
    type?: WorkoutType
    startDateTime?: string
    endDateTime?: string | null
    globalRpe?: number | null
    notes?: string | null
    location?: string | null
    source?: string | null
}