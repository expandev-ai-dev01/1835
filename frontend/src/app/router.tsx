import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ErrorBoundary from '@/core/components/ErrorBoundary';
import RootLayout from '@/pages/layouts/RootLayout';
import LoadingSpinner from '@/core/components/LoadingSpinner';

// Lazy load pages
const HomePage = lazy(() => import('@/pages/Home'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));
const PurchasePage = lazy(() => import('@/pages/Purchase'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: (
      <ErrorBoundary fallback={<div className="p-8 text-center">Routing Error</div>}>
        <div />
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'purchases/*',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <PurchasePage />
          </Suspense>
        ),
      },
      {
        path: '*', // Catch-all for 404
        element: <NotFoundPage />,
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
