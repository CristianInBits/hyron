import api from './api'
import type { User } from '../types/user'

export const userService = {
    getAll: async (): Promise<User[]> => {
        const response = await api.get('/users')
        return response.data.content  // Spring Page devuelve { content: [...] }
    },

    getById: async (id: number): Promise<User> => {
        const response = await api.get(`/users/${id}`)
        return response.data
    },
}