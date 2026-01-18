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
    // AÑADIMOS ESTO (El backend debe enviarlo)
    totalDistanceMeters: number
    maxDistanceMeters: number | null
    // OPCIONAL: Preparamos el terreno para el futuro
    image?: string | null
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