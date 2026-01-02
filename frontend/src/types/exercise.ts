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

// Respuesta completa
export type ExerciseResponse = {
    id: number
    name: string
    muscleGroup: MuscleGroup
    notes: string | null
    isUnilateral: boolean
    active: boolean
}

// Respuesta resumida (GET /active)
export type ExerciseSummaryResponse = {
    id: number
    name: string
    muscleGroup: MuscleGroup
    isUnilateral: boolean
}

// Request para POST
export type ExerciseCreateRequest = {
    name: string
    muscleGroup: MuscleGroup
    notes?: string | null
    isUnilateral?: boolean
}

// Request para PATCH
export type ExerciseUpdateRequest = {
    name?: string
    muscleGroup?: MuscleGroup
    notes?: string | null
    isUnilateral?: boolean
    active?: boolean
}

// Helper para mostrar nombres en español
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