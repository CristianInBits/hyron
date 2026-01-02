import api from './api'
import type {
    ExerciseResponse,
    ExerciseSummaryResponse,
    ExerciseCreateRequest,
    ExerciseUpdateRequest,
    MuscleGroup
} from '../types/exercise'

export const exerciseService = {
    getAll: async (userId: number): Promise<ExerciseResponse[]> => {
        const response = await api.get(`/users/${userId}/exercises`)
        return response.data
    },

    getActive: async (userId: number, muscleGroup?: MuscleGroup): Promise<ExerciseSummaryResponse[]> => {
        const params = muscleGroup ? { muscleGroup } : {}
        const response = await api.get(`/users/${userId}/exercises/active`, { params })
        return response.data
    },

    getById: async (userId: number, exerciseId: number): Promise<ExerciseResponse> => {
        const response = await api.get(`/users/${userId}/exercises/${exerciseId}`)
        return response.data
    },

    create: async (userId: number, data: ExerciseCreateRequest): Promise<ExerciseResponse> => {
        const response = await api.post(`/users/${userId}/exercises`, data)
        return response.data
    },

    update: async (userId: number, exerciseId: number, data: ExerciseUpdateRequest): Promise<ExerciseResponse> => {
        const response = await api.patch(`/users/${userId}/exercises/${exerciseId}`, data)
        return response.data
    },

    delete: async (userId: number, exerciseId: number): Promise<void> => {
        await api.delete(`/users/${userId}/exercises/${exerciseId}`)
    },
}