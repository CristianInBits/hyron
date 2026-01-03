import api from './api'
import type { HyroxDetailsResponse, HyroxDetailsCreateRequest } from '../types/hyrox'

export const hyroxService = {
    getDetails: async (userId: number, workoutId: number): Promise<HyroxDetailsResponse> => {
        const response = await api.get(`/users/${userId}/workouts/${workoutId}/hyrox`)
        return response.data
    },

    saveDetails: async (userId: number, workoutId: number, data: HyroxDetailsCreateRequest): Promise<HyroxDetailsResponse> => {
        const response = await api.put(`/users/${userId}/workouts/${workoutId}/hyrox`, data)
        return response.data
    },

    deleteDetails: async (userId: number, workoutId: number): Promise<void> => {
        await api.delete(`/users/${userId}/workouts/${workoutId}/hyrox`)
    },
}