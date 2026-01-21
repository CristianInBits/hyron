import client from '../api/axiosClient'
import type {
    PageResult,
    Shoe,
    ShoeCreateRequest,
    ShoeQueryParams,
    ShoeUpdateRequest,
} from '../types/shoe'

// API service: Shoes
export const shoeService = {
    // List (pagination / filters)
    getMyShoes: async (params?: ShoeQueryParams) => {
        const response = await client.get<PageResult<Shoe>>('/v1/shoes', { params })
        return response.data
    },

    // Detail by id
    getById: async (id: number) => {
        const response = await client.get<Shoe>(`/v1/shoes/${id}`)
        return response.data
    },

    // Create
    create: async (data: ShoeCreateRequest) => {
        const response = await client.post<Shoe>('/v1/shoes', data)
        return response.data
    },

    // Update by id
    update: async (id: number, data: ShoeUpdateRequest) => {
        const response = await client.put<Shoe>(`/v1/shoes/${id}`, data)
        return response.data
    },

    // Delete by id
    delete: async (id: number) => {
        await client.delete(`/v1/shoes/${id}`)
    },

    // Toggle "active" by sending a full update payload
    toggleActive: async (shoe: Shoe) => {
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
            active: !shoe.active,
        }

        const response = await client.put<Shoe>(`/v1/shoes/${shoe.id}`, updateData)
        return response.data
    },
}