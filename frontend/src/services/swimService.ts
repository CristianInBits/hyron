import api from './api'
import type { SwimDetailsResponse, SwimDetailsCreateRequest } from '../types/swim'

export const swimService = {
    getDetails: async (userId: number, workoutId: number): Promise<SwimDetailsResponse> => {
        const response = await api.get(`/users/${userId}/workouts/${workoutId}/swim`)
        return response.data
    },

    saveDetails: async (userId: number, workoutId: number, data: SwimDetailsCreateRequest): Promise<SwimDetailsResponse> => {
        const response = await api.put(`/users/${userId}/workouts/${workoutId}/swim`, data)
        return response.data
    },

    deleteDetails: async (userId: number, workoutId: number): Promise<void> => {
        await api.delete(`/users/${userId}/workouts/${workoutId}/swim`)
    },
}