import type { MuscleGroup } from './exercise'

export type GymSetType = 'WARMUP' | 'WORK' | 'FAILURE' | 'DROP_SET' | 'MYO_REP'

export type GymDetailsResponse = {
    id: number
    workoutId: number
    notes: string | null
    exercises: GymExerciseResponse[]
    totalDurationSeconds: number | null
    totalVolumeKg: number | null
}

export type GymExerciseResponse = {
    id: number
    orderIndex: number
    supersetId: string | null
    notes: string | null
    exerciseId: number
    exerciseName: string
    muscleGroup: MuscleGroup
    isUnilateral: boolean
    sets: GymSetResponse[]
}

export type GymSetResponse = {
    id: number
    orderIndex: number
    type: GymSetType
    weightKg: number | null
    reps: number | null
    rpe: number | null
    restSeconds: number | null
    executionSeconds: number | null
    notes: string | null
}

export type GymDetailsCreateRequest = {
    totalDurationSeconds?: number | null
    notes?: string | null
    exercises: GymExerciseRequest[]
}

export type GymExerciseRequest = {
    exerciseId: number
    supersetId?: string | null
    notes?: string | null
    sets: GymSetRequest[]
}

export type GymSetRequest = {
    type: GymSetType
    weightKg?: number | null
    reps?: number | null
    executionSeconds?: number | null
    rpe?: number | null
    restSeconds?: number | null
    notes?: string | null
}

export const gymSetTypeLabels: Record<GymSetType, string> = {
    WARMUP: 'Calentamiento',
    WORK: 'Trabajo',
    FAILURE: 'Al fallo',
    DROP_SET: 'Descendente',
    MYO_REP: 'Myo-rep',
}