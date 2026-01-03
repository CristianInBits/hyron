import type { MuscleGroup } from './exercise'

export type GymSetType = 'WARMUP' | 'WORK' | 'FAILURE' | 'DROP_SET' | 'MYO_REP'

// Response del detalle completo
export type GymDetailsResponse = {
    id: number
    workoutId: number
    notes: string | null
    exercises: GymExerciseResponse[]
    totalDurationSeconds: number | null
    totalVolumeKg: number | null
}

// Response de cada ejercicio en el workout
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

// Response de cada serie
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

// Request para crear/actualizar detalles
export type GymDetailsCreateRequest = {
    notes?: string | null
    exercises: GymExerciseRequest[]
}

// Request de cada ejercicio
export type GymExerciseRequest = {
    exerciseId: number
    supersetId?: string | null
    notes?: string | null
    sets: GymSetRequest[]
}

// Request de cada serie
export type GymSetRequest = {
    type: GymSetType
    weightKg?: number | null
    reps?: number | null
    executionSeconds?: number | null
    rpe?: number | null
    restSeconds?: number | null
    notes?: string | null
}

// Labels en español
export const gymSetTypeLabels: Record<GymSetType, string> = {
    WARMUP: 'Calentamiento',
    WORK: 'Trabajo',
    FAILURE: 'Al fallo',
    DROP_SET: 'Descendente',
    MYO_REP: 'Myo-rep',
}