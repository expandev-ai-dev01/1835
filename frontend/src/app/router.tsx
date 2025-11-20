import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy } from 'react';
import ErrorBoundary from '@/core/components/ErrorBoundary';
import RootLayout from '@/pages/layouts/RootLayout';

// Lazy load pages
const HomePage = lazy(() => import('@/pages/Home'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: (
      <ErrorBoundary>
        <div className="p-8 text-center">Routing Error</div>
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
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
