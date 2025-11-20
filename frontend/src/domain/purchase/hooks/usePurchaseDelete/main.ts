import { useMutation, useQueryClient } from '@tanstack/react-query';
import { purchaseService } from '../../services/purchaseService';

export const usePurchaseDelete = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => purchaseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
  });

  return {
    deletePurchase: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    error: deleteMutation.error,
  };
};
