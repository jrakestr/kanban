import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ChakraProvider } from '@chakra-ui/react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Login from './pages/Login';
import Auth from './utils/auth';
import theme from './theme';

export default function App() {
  const location = useLocation();
  const isAuthenticated = Auth.loggedIn();
  const isLoginPage = location.pathname === '/login';
  const showHero = !isAuthenticated && location.pathname === '/' && !isLoginPage;

  // If not authenticated and not on login page, redirect to login
  if (!isAuthenticated && !isLoginPage && location.pathname !== '/') {
    return <Navigate to="/login" replace />;
  }

  return (
    <ChakraProvider theme={theme}>
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
    </ChakraProvider>
  );
}
