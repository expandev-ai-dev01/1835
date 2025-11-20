import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { purchaseService } from '../../services/purchaseService';
import type { CreatePurchaseDto, UpdatePurchaseDto } from '../../types';

export const usePurchaseForm = (id?: string) => {
  const queryClient = useQueryClient();

  const { data: purchase, isLoading: isLoadingPurchase } = useQuery({
    queryKey: ['purchase', id],
    queryFn: () => purchaseService.getById(id!),
    enabled: !!id,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreatePurchaseDto) => purchaseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdatePurchaseDto) => purchaseService.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['purchase', id] });
    },
  });

  return {
    purchase,
    isLoadingPurchase,
    createPurchase: createMutation.mutateAsync,
    updatePurchase: updateMutation.mutateAsync,
    isSaving: createMutation.isPending || updateMutation.isPending,
    error: createMutation.error || updateMutation.error,
  };
};
