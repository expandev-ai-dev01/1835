import AppProviders from './providers';
import { AppRouter } from './router';
import '@/assets/styles/globals.css';

function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}

export default App;
