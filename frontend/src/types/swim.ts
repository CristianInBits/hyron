export type PoolType = 'SHORT_COURSE' | 'LONG_COURSE' | 'OPEN_WATER' | 'OTHER'

export type SwimIntervalType = 'WARMUP' | 'WORK' | 'DRILL' | 'SPRINT' | 'REST' | 'COOLDOWN' | 'OTHER'

export type SwimStroke = 'FREESTYLE' | 'BACKSTROKE' | 'BREASTSTROKE' | 'BUTTERFLY' | 'MEDLEY' | 'KICK' | 'DRILL' | 'OTHER'

export type SwimEquipment = 'PADDLES' | 'PULL_BUOY' | 'FINS' | 'KICKBOARD' | 'SNORKEL' | 'BAND'

export type SwimDetailsResponse = {
    id: number
    workoutId: number
    poolType: PoolType
    totalDistanceMeters: number | null
    totalTimeSeconds: number | null
    notes: string | null
    averagePaceSecondsPer100m: number | null
    intervals: SwimIntervalResponse[]
}

export type SwimIntervalResponse = {
    id: number
    orderIndex: number
    type: SwimIntervalType
    stroke: SwimStroke
    distanceMeters: number | null
    durationSeconds: number | null
    restSeconds: number | null
    rpe: number | null
    equipment: SwimEquipment[]
    notes: string | null
    paceSecondsPer100m: number | null
}

export type SwimDetailsCreateRequest = {
    poolType: PoolType
    totalDistanceMeters?: number | null
    totalTimeSeconds?: number | null
    notes?: string | null
    intervals: SwimIntervalRequest[]
}

export type SwimIntervalRequest = {
    type: SwimIntervalType
    stroke: SwimStroke
    distanceMeters?: number | null
    durationSeconds?: number | null
    restSeconds?: number | null
    rpe?: number | null
    equipment?: SwimEquipment[]
    notes?: string | null
}

export const poolTypeLabels: Record<PoolType, string> = {
    SHORT_COURSE: 'Piscina 25m',
    LONG_COURSE: 'Piscina 50m',
    OPEN_WATER: 'Aguas abiertas',
    OTHER: 'Otro',
}

export const swimIntervalTypeLabels: Record<SwimIntervalType, string> = {
    WARMUP: 'Calentamiento',
    WORK: 'Trabajo',
    DRILL: 'Técnica',
    SPRINT: 'Sprint',
    REST: 'Descanso',
    COOLDOWN: 'Vuelta a la calma',
    OTHER: 'Otro',
}

export const swimStrokeLabels: Record<SwimStroke, string> = {
    FREESTYLE: 'Crol',
    BACKSTROKE: 'Espalda',
    BREASTSTROKE: 'Braza',
    BUTTERFLY: 'Mariposa',
    MEDLEY: 'Estilos',
    KICK: 'Pies',
    DRILL: 'Técnica',
    OTHER: 'Otro',
}

export const swimEquipmentLabels: Record<SwimEquipment, string> = {
    PADDLES: 'Palas',
    PULL_BUOY: 'Pull buoy',
    FINS: 'Aletas',
    KICKBOARD: 'Tabla',
    SNORKEL: 'Tubo',
    BAND: 'Goma',
}