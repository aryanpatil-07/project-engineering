import FragmentsPage from './pages/FragmentsPage';
import LogoutButton from './components/LogoutButton';

export default function App() {
  return (
    <div>
      <header>
        <h1>Fragments Story Platform</h1>
        <LogoutButton />
      </header>
      <FragmentsPage />
    </div>
  );
}
