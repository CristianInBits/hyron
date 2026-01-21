import client from '../api/axiosClient'; // Asegúrate de que la ruta a tu cliente axios es correcta
import type {
    PageResult,
    Shoe,
    ShoeCreateRequest,
    ShoeQueryParams,
    ShoeUpdateRequest
} from '../types/shoe';

export const shoeService = {

    // 1. OBTENER LISTA (Con filtros y paginación)
    getMyShoes: async (params?: ShoeQueryParams) => {
        // Axios convierte automáticamente el objeto params a ?page=0&size=10...
        const response = await client.get<PageResult<Shoe>>('/v1/shoes', { params });
        return response.data;
    },

    // 2. OBTENER DETALLE (Por ID)
    getById: async (id: number) => {
        const response = await client.get<Shoe>(`/v1/shoes/${id}`);
        return response.data;
    },

    // 3. CREAR (POST)
    create: async (data: ShoeCreateRequest) => {
        const response = await client.post<Shoe>('/v1/shoes', data);
        return response.data;
    },

    // 4. ACTUALIZAR (PUT)
    // Recibimos el ID y los datos por separado para mayor claridad
    update: async (id: number, data: ShoeUpdateRequest) => {
        const response = await client.put<Shoe>(`/v1/shoes/${id}`, data);
        return response.data;
    },

    // 5. BORRAR (DELETE)
    delete: async (id: number) => {
        await client.delete(`/v1/shoes/${id}`);
    },

    // 6. TOGGLE ACTIVE (Un método especial muy útil)
    // A veces queremos solo archivar la zapatilla sin editar todo el formulario.
    // Como usamos PUT, tenemos que "trucar" esto: pedimos la zapatilla, cambiamos active y la guardamos.
    toggleActive: async (shoe: Shoe) => {
        // Creamos el objeto update basándonos en la zapatilla actual
        const updateData: ShoeUpdateRequest = {
            brand: shoe.brand,
            model: shoe.model,
            type: shoe.type,
            purchaseDate: shoe.purchaseDate,
            nickname: shoe.nickname,
            imageUrl: shoe.imageUrl,
            colorway: shoe.colorway,
            notes: shoe.notes,
            favorite: shoe.favorite,
            initialDistanceMeters: shoe.initialDistanceMeters,
            maxDistanceMeters: shoe.maxDistanceMeters,
            // AQUÍ ESTÁ EL CAMBIO MÁGICO
            active: !shoe.active
        };

        const response = await client.put<Shoe>(`/v1/shoes/${shoe.id}`, updateData);
        return response.data;
    }
};