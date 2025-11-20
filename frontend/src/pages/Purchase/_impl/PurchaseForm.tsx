import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { purchaseSchema, type PurchaseFormData } from '@/domain/purchase/types';
import { usePurchaseForm } from '@/domain/purchase/hooks/usePurchaseForm';
import LoadingSpinner from '@/core/components/LoadingSpinner';

export const PurchaseForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const {
    purchase,
    isLoadingPurchase,
    createPurchase,
    updatePurchase,
    isSaving,
    error: submitError,
  } = usePurchaseForm(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      productName: '',
      quantity: undefined,
      price: undefined,
      purchaseDate: new Date(),
    },
  });

  useEffect(() => {
    if (purchase) {
      reset({
        productName: purchase.productName,
        quantity: Number(purchase.quantity),
        price: Number(purchase.price),
        purchaseDate: new Date(purchase.purchaseDate),
      });
    }
  }, [purchase, reset]);

  const onSubmit = async (data: PurchaseFormData) => {
    try {
      if (isEditMode) {
        await updatePurchase(data);
      } else {
        await createPurchase(data);
      }
      navigate('/purchases');
    } catch (err) {
      console.error('Failed to save purchase', err);
    }
  };

  if (isEditMode && isLoadingPurchase) return <LoadingSpinner size="lg" />;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        {isEditMode ? 'Edit Purchase' : 'New Purchase'}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-lg bg-white p-6 shadow-sm border border-gray-200"
      >
        {submitError && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {submitError.message || 'An error occurred while saving.'}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            id="productName"
            type="text"
            {...register('productName')}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g., Rice 5kg"
          />
          {errors.productName && (
            <p className="text-sm text-red-600">{errors.productName.message}</p>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              step="0.001"
              {...register('quantity', { valueAsNumber: true })}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.quantity && <p className="text-sm text-red-600">{errors.quantity.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Unit Price ($)
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.price && <p className="text-sm text-red-600">{errors.price.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            id="purchaseDate"
            type="date"
            {...register('purchaseDate', { valueAsDate: true })}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.purchaseDate && (
            <p className="text-sm text-red-600">{errors.purchaseDate.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/purchases')}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Purchase'}
          </button>
        </div>
      </form>
    </div>
  );
};
