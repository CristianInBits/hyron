// Enum para el tipo de intervalo (Mapea tu Java RunIntervalType)
export type RunIntervalType = 'WORK' | 'REST' | 'WARMUP' | 'COOLDOWN' | 'RECOVERY';

// Mapeo de ShoeSummaryResponse (simplificado por ahora)
export type ShoeSummaryResponse = {
    id: number;
    name: string;
    brand: string;
}

// Mapeo de RunIntervalResponse
export type RunIntervalResponse = {
    id: number;
    orderIndex: number;
    type: RunIntervalType;
    durationSeconds: number;
    distanceMeters: number;
    averageHr?: number;
    cadenceSpm?: number;
    elevationGain?: number;
    notes?: string;
    paceSecondsPerKm?: number;
}

// Mapeo de RunDetailsResponse
export type RunDetailsResponse = {
    id: number;
    workoutId: number;
    totalDistanceMeters: number;
    totalElevationGain?: number;
    averageHr?: number;
    shoe?: ShoeSummaryResponse; // Puede venir null si no usó zapatillas registradas
    notes?: string;
    averagePaceSecondsPerKm?: number;
    intervals: RunIntervalResponse[];
}

// --- REQUESTS (Para enviar datos) ---

// Mapeo de RunIntervalRequest
export type RunIntervalRequest = {
    type: RunIntervalType;
    durationSeconds: number;
    distanceMeters?: number; // Java: @PositiveOrZero
    averageHr?: number;
    cadenceSpm?: number;
    elevationGain?: number;
    notes?: string;
}

// Mapeo de RunDetailsCreateRequest
export type RunDetailsCreateRequest = {
    totalDistanceMeters: number;
    totalElevationGain?: number;
    averageHr?: number;
    shoeId?: number; // Java: @Positive (pero opcional en form si no seleccionas)
    notes?: string;
    intervals: RunIntervalRequest[]; // Java: @NotEmpty (¡Obligatorio!)
}