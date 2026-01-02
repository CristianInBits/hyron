import api from './api'
import type { ShoeResponse, ShoeSummaryResponse, ShoeCreateRequest, ShoeUpdateRequest } from '../types/shoe'

export const shoeService = {
    getAll: async (userId: number): Promise<ShoeResponse[]> => {
        const response = await api.get(`/users/${userId}/shoes`)
        return response.data
    },

    getActive: async (userId: number): Promise<ShoeSummaryResponse[]> => {
        const response = await api.get(`/users/${userId}/shoes/active`)
        return response.data
    },

    getById: async (userId: number, shoeId: number): Promise<ShoeResponse> => {
        const response = await api.get(`/users/${userId}/shoes/${shoeId}`)
        return response.data
    },

    create: async (userId: number, data: ShoeCreateRequest): Promise<ShoeResponse> => {
        const response = await api.post(`/users/${userId}/shoes`, data)
        return response.data
    },

    update: async (userId: number, shoeId: number, data: ShoeUpdateRequest): Promise<ShoeResponse> => {
        const response = await api.patch(`/users/${userId}/shoes/${shoeId}`, data)
        return response.data
    },

    delete: async (userId: number, shoeId: number): Promise<void> => {
        await api.delete(`/users/${userId}/shoes/${shoeId}`)
    },
}