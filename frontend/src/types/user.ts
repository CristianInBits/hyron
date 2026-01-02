export type User = {
    id: number
    name: string
    email: string
    registeredAt: string
}

export type UserCreateRequest = {
    name: string
    email: string
}

export type UserUpdateRequest = {
    name?: string
    email?: string
}