import { UserLogin } from "../interfaces/UserLogin";

const login = async (userInfo: UserLogin) => {
  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Invalid credentials');
    }

    const data = await response.json();
    if (!data.token) {
      throw new Error('No token received from server');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred');
  }
}

// Authentication helper functions
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const isLoggedIn = (): boolean => {
  const token = getToken();
  return !!token;
};
export { login };
