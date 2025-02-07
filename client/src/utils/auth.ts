// Must be a valid JWT token
// Must have an expiration (exp) claim
// Dependencies: Required for all authenticated API calls

import { JwtPayload, jwtDecode } from 'jwt-decode';

// Define our custom JWT payload type
interface CustomJwtPayload extends JwtPayload {
  id: number;
  username: string;
}

class AuthService {
  private sessionCheckInterval: number | null = null;

  constructor() {
    // Start session check when service is instantiated
    this.startSessionCheck();
  }

  private startSessionCheck() {
    // Check session every minute
    this.sessionCheckInterval = window.setInterval(() => {
      if (this.loggedIn()) {
        const token = this.getToken();
        if (token && this.isTokenExpired(token)) {
          this.logout();
        }
      }
    }, 60000); // Check every minute
  }

  private stopSessionCheck() {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
  }

  getProfile(): CustomJwtPayload | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<CustomJwtPayload>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  loggedIn(): boolean {
    const token = this.getToken();
    return token ? !this.isTokenExpired(token) : false;
  }
  
  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      if (!decoded.exp) return true;
      
      const currentTime = Date.now() / 1000;
      const bufferTime = 60; // 60 seconds buffer
      return decoded.exp < (currentTime + bufferTime);
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  login(token: string): void {
    localStorage.setItem('token', token);
    this.startSessionCheck();
    window.location.assign('/');
  }

  logout(): void {
    localStorage.removeItem('token');
    this.stopSessionCheck();
  }
}

export default new AuthService();
