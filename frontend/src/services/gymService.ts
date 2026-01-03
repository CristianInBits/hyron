import api from './api'
import type { GymDetailsResponse, GymDetailsCreateRequest } from '../types/gym'

export const gymService = {
    getDetails: async (userId: number, workoutId: number): Promise<GymDetailsResponse> => {
        const response = await api.get(`/users/${userId}/workouts/${workoutId}/gym`)
        return response.data
    },

    saveDetails: async (userId: number, workoutId: number, data: GymDetailsCreateRequest): Promise<GymDetailsResponse> => {
        const response = await api.put(`/users/${userId}/workouts/${workoutId}/gym`, data)
        return response.data
    },

    deleteDetails: async (userId: number, workoutId: number): Promise<void> => {
        await api.delete(`/users/${userId}/workouts/${workoutId}/gym`)
    },
}