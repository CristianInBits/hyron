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
    totalDurationSeconds: number
    totalRunDistanceMeters: number
    totalSwimDistanceMeters: number

    workoutsThisWeek: number
    totalDurationSecondsThisWeek: number
    totalRunDistanceMetersThisWeek: number
    totalSwimDistanceMetersThisWeek: number

    workoutsThisMonth: number
    totalDurationSecondsThisMonth: number
    totalRunDistanceMetersThisMonth: number
    totalSwimDistanceMetersThisMonth: number

    workoutsByTypeThisWeek: Record<WorkoutType, number>

    lastWorkout: WorkoutSummaryResponse | null
    
    topShoes: ShoeStatsResponse[]
}