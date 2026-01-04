import api from './api'
import type { UserStatsResponse } from '../types/stats'

export const statsService = {
    getStats: async (userId: number): Promise<UserStatsResponse> => {
        const response = await api.get(`/users/${userId}/stats`)
        return response.data
    },
}