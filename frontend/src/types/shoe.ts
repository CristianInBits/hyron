export type ShoeType = 'RUNNING' | 'TRAIL' | 'CROSSFIT' | 'HYROX' | 'WALKING';
export type ShoeStatus = 'OK' | 'WARNING' | 'OVERDUE';

// --- RESPONSE (Lo que recibes al leer una zapatilla) ---
export interface Shoe {
    id: number;
    brand: string;
    model: string;
    nickname: string | null;
    type: ShoeType;
    imageUrl: string | null;
    colorway: string | null;
    notes: string | null;
    favorite: boolean;
    purchaseDate: string;
    active: boolean;

    // Métricas calculadas
    initialDistanceMeters: number;
    accumulatedDistanceMeters: number;
    maxDistanceMeters: number;
    totalDistanceMeters: number;
    remainingDistanceMeters: number;
    usagePercent: number;
    status: ShoeStatus;
}

// --- CREATE REQUEST (POST) ---
export interface ShoeCreateRequest {
    brand: string;
    model: string;
    nickname?: string;
    type?: ShoeType;
    imageUrl?: string;
    colorway?: string;
    notes?: string;
    favorite?: boolean;
    purchaseDate?: string;
    initialDistanceMeters?: number;
    maxDistanceMeters?: number;
    active?: boolean;
}

// --- UPDATE REQUEST (PUT) ---
export interface ShoeUpdateRequest {
    brand: string;
    model: string;
    type: ShoeType;
    
    // Campos que permitimos borrar enviando 'null' o modificar enviando string
    nickname?: string | null;
    imageUrl?: string | null;
    colorway?: string | null;
    notes?: string | null;
    
    purchaseDate?: string;
    favorite?: boolean;
    active?: boolean;

    // Métricas editables
    initialDistanceMeters?: number;
    maxDistanceMeters?: number;
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