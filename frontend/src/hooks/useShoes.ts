import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shoeService } from '../services/shoeService';
import type { Shoe, ShoeCreateRequest, ShoeQueryParams, ShoeUpdateRequest } from '../types/shoe';

export const useShoes = (params?: ShoeQueryParams) => {
    return useQuery({
        queryKey: ['shoes', params],
        queryFn: () => shoeService.getMyShoes(params),
        placeholderData: (previousData) => previousData,
    });
};

export const useShoe = (id: number) => {
    return useQuery({
        queryKey: ['shoe', id],
        queryFn: () => shoeService.getById(id),
        enabled: !!id,
    });
};

export const useCreateShoe = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newShoe: ShoeCreateRequest) => shoeService.create(newShoe),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shoes'] });
        },
    });
};

export const useUpdateShoe = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: ShoeUpdateRequest }) =>
            shoeService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shoes'] });
        },
    });
};

export const useDeleteShoe = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => shoeService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shoes'] });
        },
    });
};

export const useToggleShoeActive = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (shoe: Shoe) => shoeService.toggleActive(shoe),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shoes'] });
        },
    });
};