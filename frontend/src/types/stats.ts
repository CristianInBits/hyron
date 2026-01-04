import type { WorkoutSummaryResponse, WorkoutType } from './workout'

export type ShoeStatsResponse = {
    id: number
    brand: string
    model: string
    nickname: string | null
    totalDistanceMeters: number
    maxDistanceMeters: number | null
    percentageUsed: number | null
}

export type UserStatsResponse = {
    totalWorkouts: number
    workoutsThisWeek: number
    totalDurationSecondsThisWeek: number | null
    totalDistanceMetersThisWeek: number | null
    workoutsThisMonth: number
    totalDurationSecondsThisMonth: number | null
    totalDistanceMetersThisMonth: number | null
    workoutsByTypeThisWeek: Record<WorkoutType, number>
    lastWorkout: WorkoutSummaryResponse | null
    topShoes: ShoeStatsResponse[]
}