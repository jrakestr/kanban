// Parameter: Authorization
// Format: Bearer ${token}

import { UserLogin } from "../interfaces/UserLogin";

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
  };
}

const login = async (userInfo: UserLogin): Promise<LoginResponse> => {
  console.log('🔍 [AuthAPI] Login request started');
	try {
		// Get the API base URL from environment variables
		const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
		console.log('Login attempt:', { apiUrl, username: userInfo.username });

		console.log('🔍 [AuthAPI] Making fetch request to:', `${apiUrl}/auth/login`);
		const response = await fetch(
			`${apiUrl}/auth/login`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userInfo),
				credentials: 'include'
			}
		);

		console.log('Response:', { 
			status: response.status,
			statusText: response.statusText,
			headers: Object.fromEntries(response.headers.entries())
		});

		if (!response.ok) {
			let errorMessage;
			try {
				const errorData = await response.json();
				errorMessage = errorData.message;
			} catch (e) {
				errorMessage = `HTTP error! status: ${response.status}`;
			}
			throw new Error(errorMessage);
		}

		const data = await response.json();
		console.log('🔍 [AuthAPI] Server response:', {
			status: response.status,
			data: data
		});

		if (!data.token || !data.user || !data.user.id || !data.user.username) {
			throw new Error("Invalid response format from server");
		}

		return data as LoginResponse;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
		throw new Error("An unexpected error occurred");
	}
};

// Authentication helper functions
export const getToken = (): string | null => {
	return localStorage.getItem("token");
};

export const isLoggedIn = (): boolean => {
	const token = getToken();
	return !!token;
};
export { login };
