import api from './api'
import type {
    WorkoutDetailResponse,
    WorkoutSummaryResponse,
    WorkoutCreateRequest,
    WorkoutUpdateRequest
} from '../types/workout'

export const workoutService = {
    getAll: async (userId: number): Promise<WorkoutSummaryResponse[]> => {
        const response = await api.get(`/users/${userId}/workouts`)
        return response.data.content
    },

    getById: async (userId: number, workoutId: number): Promise<WorkoutDetailResponse> => {
        const response = await api.get(`/users/${userId}/workouts/${workoutId}`)
        return response.data
    },

    create: async (userId: number, data: WorkoutCreateRequest): Promise<WorkoutDetailResponse> => {
        const response = await api.post(`/users/${userId}/workouts`, data)
        return response.data
    },

    update: async (userId: number, workoutId: number, data: WorkoutUpdateRequest): Promise<WorkoutDetailResponse> => {
        const response = await api.patch(`/users/${userId}/workouts/${workoutId}`, data)
        return response.data
    },

    delete: async (userId: number, workoutId: number): Promise<void> => {
        await api.delete(`/users/${userId}/workouts/${workoutId}`)
    },
}