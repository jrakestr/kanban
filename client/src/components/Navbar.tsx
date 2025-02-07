// Parameter: Authorization
// Format: Bearer ${token}
// All components that make API calls require authentication

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import auth from '../utils/auth';

const Navbar = () => {
  const [ loginCheck, setLoginCheck ] = useState(false);
  const { logout } = useAuth();

  const checkLogin = () => {
    if(auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  useEffect(() => {
    console.log(loginCheck);
    checkLogin();
  }, [loginCheck])

  return (
    <div className='nav'>
      <div className='nav-title'>
        <Link to='/'>Krazy Kanban Board</Link>
      </div>
      <ul>
      {
        !loginCheck ? (
          <li className='nav-item'>
            <button type='button'>
              <Link to='/login'>Login</Link>
            </button>
          </li>
        ) : (
          <li className='nav-item'>
            <button type='button' onClick={(e) => {
              e.preventDefault();
              logout();
              setLoginCheck(false);
            }}>Logout</button>
          </li>
        )
      }
      </ul>
    </div>
  )
}

export default Navbar;
