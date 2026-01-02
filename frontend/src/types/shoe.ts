export type ShoeResponse = {
    id: number
    brand: string
    model: string
    nickname: string | null
    active: boolean
    initialDistanceMeters: number
    maxDistanceMeters: number | null
    totalDistanceMeters: number | null
    percentageUsed: number | null
}

// Respuesta resumida (GET /active)
export type ShoeSummaryResponse = {
    id: number
    brand: string
    model: string
    nickname: string | null
}

// Request para POST
export type ShoeCreateRequest = {
    brand: string
    model: string
    nickname?: string | null
    initialDistanceMeters?: number
    maxDistanceMeters?: number | null
}

// Request para PATCH
export type ShoeUpdateRequest = {
    brand?: string
    model?: string
    nickname?: string | null
    initialDistanceMeters?: number
    maxDistanceMeters?: number | null
    active?: boolean
}