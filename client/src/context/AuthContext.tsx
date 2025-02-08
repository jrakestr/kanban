import React, { createContext, useState, ReactNode, useContext } from 'react';
import { UserLogin } from '../interfaces/UserLogin';
import { login as apiLogin } from '../api/authAPI';

// Custom hook to use auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// Define the shape of our auth state
interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: number | null;
    username: string | null;
  } | null;
  token: string | null;
}

// Define what our context will provide
interface AuthContextType extends AuthState {
  login: (credentials: UserLogin) => Promise<void>;
  logout: () => void;
}

// Create context with a default value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

// Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize state from localStorage if token exists
  const [authState, setAuthState] = useState<AuthState>(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    return {
      isAuthenticated: !!token,
      user: user,
      token: token
    };
  });

  const login = async (credentials: UserLogin) => {
    console.log('🔍 [AuthContext] Login attempt:', { username: credentials.username });
    try {
      const response = await apiLogin(credentials);
      if (!response.token || !response.user) {
        throw new Error('Invalid response from server');
      }
      
      // Save to localStorage
      console.log('🔍 [AuthContext] Saving to localStorage:', { token: response.token?.substring(0, 10) + '...', user: response.user });
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      console.log('🔍 [AuthContext] Updating auth state');
      setAuthState({
        isAuthenticated: true,
        user: response.user,
        token: response.token
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
        token: authState.token,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
