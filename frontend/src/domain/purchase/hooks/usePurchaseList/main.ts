import { useQuery } from '@tanstack/react-query';
import { purchaseService } from '../../services/purchaseService';
import { useMemo } from 'react';
import { isSameMonth, isSameYear, parseISO } from 'date-fns';

export const usePurchaseList = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['purchases'],
    queryFn: () => purchaseService.list(1, 100), // Fetching up to 100 items to calculate monthly total reasonably well for this scope
  });

  const purchases = useMemo(() => {
    return data?.data || [];
  }, [data]);

  const totalSpentCurrentMonth = useMemo(() => {
    if (!purchases.length) return 0;

    const now = new Date();
    return purchases
      .filter((p) => {
        const pDate = parseISO(p.purchaseDate);
        return isSameMonth(pDate, now) && isSameYear(pDate, now);
      })
      .reduce((acc, curr) => acc + Number(curr.totalItemPrice), 0);
  }, [purchases]);

  return {
    purchases,
    totalSpentCurrentMonth,
    isLoading,
    error,
    refetch,
  };
};
