import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900">FoodTrack</h1>
      <p className="text-lg text-gray-600">Simple food purchase tracking system</p>
      <div className="flex gap-4">
        <Link
          to="/purchases"
          className="rounded-md bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
        >
          Manage Purchases
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
