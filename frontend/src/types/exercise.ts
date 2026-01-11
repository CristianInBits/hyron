export type MuscleGroup =
    | 'CHEST'
    | 'BACK'
    | 'LEGS'
    | 'SHOULDERS'
    | 'ARMS'
    | 'ABS'
    | 'CARDIO'
    | 'FULL_BODY'
    | 'OTHER'

export type ExerciseResponse = {
    id: number
    name: string
    muscleGroup: MuscleGroup
    notes: string | null
    isUnilateral: boolean
    active: boolean
}

export type ExerciseSummaryResponse = {
    id: number
    name: string
    muscleGroup: MuscleGroup
    isUnilateral: boolean
}

export type ExerciseCreateRequest = {
    name: string
    muscleGroup: MuscleGroup
    notes?: string | null
    isUnilateral?: boolean
}

export type ExerciseUpdateRequest = {
    name?: string
    muscleGroup?: MuscleGroup
    notes?: string | null
    isUnilateral?: boolean
    active?: boolean
}

export const muscleGroupLabels: Record<MuscleGroup, string> = {
    CHEST: 'Pecho',
    BACK: 'Espalda',
    LEGS: 'Piernas',
    SHOULDERS: 'Hombros',
    ARMS: 'Brazos',
    ABS: 'Abdominales',
    CARDIO: 'Cardio',
    FULL_BODY: 'Cuerpo completo',
    OTHER: 'Otro',
}