import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
      <p className="mb-8 text-xl text-gray-600">Page not found</p>
      <Link
        to="/"
        className="rounded-md bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
