import api from './api'
import type { User } from '../types/user'

export const userService = {
    getAll: async (): Promise<User[]> => {
        const response = await api.get('/users')
        return response.data.content
    },

    getById: async (id: number): Promise<User> => {
        const response = await api.get(`/users/${id}`)
        return response.data
    },

    create: async (data: { name: string; email: string }): Promise<User> => {
        const response = await api.post('/users', data)
        return response.data
    },

    update: async (id: number, data: { name?: string; email?: string }): Promise<User> => {
        const response = await api.patch(`/users/${id}`, data)
        return response.data
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/users/${id}`)
    },
}