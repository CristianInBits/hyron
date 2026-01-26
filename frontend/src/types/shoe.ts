export type ShoeType = 'RUNNING' | 'TRAIL' | 'CROSSFIT' | 'HYROX' | 'WALKING';
export type ShoeStatus = 'OK' | 'WARNING' | 'OVERDUE';

// --- RESPONSE (Lo que recibes al leer una zapatilla) ---
export interface Shoe {
    // IDs
    id: number;

    // Datos obligatorios importantes
    brand: string;
    model: string;

    // Datos opcionales
    nickname: string | null;
    imageUrl: string | null;
    colorway: string | null;
    notes: string | null;
    purchaseDate: string | null;

    // Metadatos/Flags
    type: ShoeType;
    favorite: boolean;
    active: boolean;

    // Métricas
    initialDistanceMeters: number;
    accumulatedDistanceMeters: number;
    maxDistanceMeters: number | null;

    // Métricas calculadas
    totalDistanceMeters: number;
    remainingDistanceMeters: number | null;
    usagePercent: number | null;
    status: ShoeStatus | null;
}

// --- CREATE REQUEST (POST) ---
export interface ShoeCreateRequest {
    brand: string;
    model: string;

    nickname: string | null;
    imageUrl: string | null;
    colorway: string | null;
    notes: string | null;
    purchaseDate: string | null;

    type: ShoeType;
    favorite: boolean;
    active: boolean;

    initialDistanceMeters: number;
    maxDistanceMeters: number | null;
}

// --- UPDATE REQUEST (PUT) ---
export interface ShoeUpdateRequest {
    brand: string;
    model: string;

    nickname: string | null;
    imageUrl: string | null;
    colorway: string | null;
    notes: string | null;
    purchaseDate: string | null;

    type: ShoeType;
    favorite: boolean;
    active: boolean;

    // Métricas editables
    initialDistanceMeters: number;
    maxDistanceMeters: number | null;
}

// --- PAGINACIÓN (PageResult) ---
export interface PageResult<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
}

// --- FILTROS DE BÚSQUEDA ---
export interface ShoeQueryParams {
    page?: number;
    size?: number;
    sort?: string[];
    type?: ShoeType;
    active?: boolean;
}