// Parameter: Authorization
// Format: Bearer ${token}


import { Navigate } from 'react-router-dom';
import Auth from '../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!Auth.loggedIn()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
