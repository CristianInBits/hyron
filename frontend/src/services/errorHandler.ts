import { AxiosError } from 'axios'

type ApiErrorResponse = {
    message?: string
    error?: string
    status?: number
}

export function getErrorMessage(error: unknown): string {
    if (error instanceof AxiosError) {
        const data = error.response?.data as ApiErrorResponse | undefined

        if (data?.message) {
            return data.message
        }
        if (data?.error) {
            return data.error
        }

        switch (error.response?.status) {
            case 400:
                return 'Datos inválidos'
            case 404:
                return 'No encontrado'
            case 409:
                return 'Ya existe un registro con esos datos'
            case 500:
                return 'Error del servidor'
            default:
                return 'Error de conexión'
        }
    }

    if (error instanceof Error) {
        return error.message
    }

    return 'Error desconocido'
}