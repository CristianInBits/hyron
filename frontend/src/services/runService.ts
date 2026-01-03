import api from './api'
import type { RunDetailsResponse, RunDetailsCreateRequest } from '../types/run'

export const runService = {
    getDetails: async (userId: number, workoutId: number): Promise<RunDetailsResponse> => {
        const response = await api.get(`/users/${userId}/workouts/${workoutId}/run`)
        return response.data
    },

    saveDetails: async (userId: number, workoutId: number, data: RunDetailsCreateRequest): Promise<RunDetailsResponse> => {
        const response = await api.put(`/users/${userId}/workouts/${workoutId}/run`, data)
        return response.data
    },

    deleteDetails: async (userId: number, workoutId: number): Promise<void> => {
        await api.delete(`/users/${userId}/workouts/${workoutId}/run`)
    },
}