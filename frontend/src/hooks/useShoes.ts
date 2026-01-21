import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shoeService } from '../services/shoeService';
import type { ShoeCreateRequest, ShoeQueryParams, ShoeUpdateRequest, Shoe } from '../types/shoe';

// 1️⃣ HOOK PARA LEER (GET)
// Este hook se usa así: const { data, isLoading } = useShoes();
export const useShoes = (params?: ShoeQueryParams) => {
    return useQuery({
        // La 'queryKey' es como el nombre del archivo en caché. 
        // Si cambian los params (ej: pasas de página 1 a 2), React Query sabe que debe volver a pedir datos.
        queryKey: ['shoes', params],

        // Aquí le decimos qué función del servicio debe ejecutar
        queryFn: () => shoeService.getMyShoes(params),

        // Esto mantiene los datos viejos en pantalla mientras cargan los nuevos (mejor experiencia de usuario)
        placeholderData: (previousData) => previousData,
    });
};

// 2️⃣ HOOK PARA UN DETALLE (GET ONE)
export const useShoe = (id: number) => {
    return useQuery({
        queryKey: ['shoe', id],
        queryFn: () => shoeService.getById(id),
        enabled: !!id, // Solo se ejecuta si hay un ID (evita errores si id es null)
    });
};

// 3️⃣ HOOK PARA CREAR (POST)
export const useCreateShoe = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newShoe: ShoeCreateRequest) => shoeService.create(newShoe),
        
        onSuccess: () => {
            // ¡AQUÍ ESTÁ LA MAGIA! ✨
            // Cuando se crea una zapatilla con éxito, le decimos a React Query:
            // "Oye, la lista de 'shoes' ha cambiado. Bórrala y vuélvela a pedir".
            // Esto actualiza tu lista automáticamente sin que tú hagas nada.
            queryClient.invalidateQueries({ queryKey: ['shoes'] });
        },
    });
};

// 4️⃣ HOOK PARA ACTUALIZAR (PUT)
export const useUpdateShoe = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: ShoeUpdateRequest }) =>
            shoeService.update(id, data),
        onSuccess: () => {
            // Al actualizar, refrescamos la lista general y también el detalle de esa zapatilla
            queryClient.invalidateQueries({ queryKey: ['shoes'] });
        },
    });
};

// 5️⃣ HOOK PARA BORRAR (DELETE)
export const useDeleteShoe = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => shoeService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shoes'] });
        },
    });
};