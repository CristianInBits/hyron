export type Shoe = {
    id: number
    brand: string
    model: string
    nickname: string | null
    active: boolean
    initialDistanceMeters: number
    maxDistanceMeters: number | null
    totalDistanceMeters: number
    percentageUsed: number | null
}

export type ShoeSummaryResponse = {
    id: number
    brand: string
    model: string
    nickname: string | null
    image: string | null         // Nuevo: Coincide con el DTO Java
    totalDistanceMeters: number  // Nuevo: Ya viene calculado
    maxDistanceMeters: number | null
}

export type ShoeCreateRequest = {
    brand: string
    model: string
    nickname?: string | null
    initialDistanceMeters?: number
    maxDistanceMeters?: number | null
}

export type ShoeUpdateRequest = {
    brand?: string
    model?: string
    nickname?: string | null
    initialDistanceMeters?: number
    maxDistanceMeters?: number | null
    active?: boolean
}