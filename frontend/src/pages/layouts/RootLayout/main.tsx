import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import LoadingSpinner from '@/core/components/LoadingSpinner';

export const RootLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner size="lg" />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};

export default RootLayout;
