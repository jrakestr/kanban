import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ChakraProvider } from '@chakra-ui/react';

import { AuthProvider } from './context/AuthContext';
import { useAuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Login from './pages/Login';
import theme from './theme';

function AppContent() {
  const location = useLocation();
  const { isAuthenticated } = useAuthContext();
  const isLoginPage = location.pathname === '/login';
  const showHero = !isAuthenticated && location.pathname === '/' && !isLoginPage;

  // If not authenticated and not on login page, redirect to login
  if (!isAuthenticated && !isLoginPage && location.pathname !== '/') {
    return <Navigate to="/login" replace />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      {isLoginPage ? (
        <Login />
      ) : (
        <div>
          <Navbar />
          <main>
            {showHero ? <Hero /> : <Outlet />}
          </main>
        </div>
      )}
    </DndProvider>
  );
}

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ChakraProvider>
  );
}
