import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { usePurchaseList } from '@/domain/purchase/hooks/usePurchaseList';
import { usePurchaseDelete } from '@/domain/purchase/hooks/usePurchaseDelete';
import LoadingSpinner from '@/core/components/LoadingSpinner';
import ConfirmationModal from '@/core/components/ConfirmationModal';

export const PurchaseList = () => {
  const { purchases, totalSpentCurrentMonth, isLoading, error } = usePurchaseList();
  const { deletePurchase, isDeleting } = usePurchaseDelete();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (deleteId) {
      await deletePurchase(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return <div className="text-red-600">Error loading purchases: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900">Purchases</h1>
        <Link
          to="new"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add Purchase
        </Link>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
        <p className="text-sm text-gray-500">Total Spent (Current Month)</p>
        <p className="text-3xl font-bold text-green-600">
          $
          {totalSpentCurrentMonth.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>

      {purchases.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="mb-4 text-gray-500">No purchases registered yet.</p>
          <Link to="new" className="text-blue-600 hover:underline">
            Add First Purchase
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                <tr>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Quantity</th>
                  <th className="px-6 py-3">Total Price</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {purchases.map((purchase) => (
                  <tr key={purchase.purchaseId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{purchase.productName}</td>
                    <td className="px-6 py-4">
                      {format(new Date(purchase.purchaseDate), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4">{purchase.quantity}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      ${Number(purchase.totalItemPrice).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`${purchase.purchaseId}/edit`}
                        className="mr-4 font-medium text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteId(purchase.purchaseId)}
                        className="font-medium text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={!!deleteId}
        title="Delete Purchase"
        message="Are you sure you want to delete this purchase? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
      />
    </div>
  );
};
