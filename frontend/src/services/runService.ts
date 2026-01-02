import api from './api';
import type { RunDetailsResponse, RunDetailsCreateRequest } from '../types/run';

export const runService = {
    // GET: Obtener detalles
    getByWorkoutId: async (userId: number, workoutId: number): Promise<RunDetailsResponse> => {
        const response = await api.get(`/users/${userId}/workouts/${workoutId}/run`);
        return response.data;
    },

    // PUT: Guardar (Crear o Actualizar) detalles
    // Cambiamos api.post por api.put para coincidir con el @PutMapping del Controller
    save: async (userId: number, workoutId: number, data: RunDetailsCreateRequest): Promise<RunDetailsResponse> => {
        const response = await api.put(`/users/${userId}/workouts/${workoutId}/run`, data);
        return response.data;
    }
};