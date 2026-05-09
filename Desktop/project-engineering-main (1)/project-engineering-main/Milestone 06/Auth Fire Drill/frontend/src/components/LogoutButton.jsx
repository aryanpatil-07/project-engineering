import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      logout();
    }
  };

  return (
    <button type="button" onClick={handleLogout}>
      Logout
    </button>
  );
}
