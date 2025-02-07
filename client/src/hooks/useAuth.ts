import { useNavigate } from 'react-router-dom';
import auth from '../utils/auth';

export const useAuth = () => {
  const navigate = useNavigate();

  const login = (token: string) => {
    console.log('Login hook called');
    auth.login(token);
    navigate('/', { replace: true });
  };

  const logout = () => {
    console.log('Logout hook called');
    auth.logout();
    navigate('/login', { replace: true });
  };

  return { login, logout };
};
