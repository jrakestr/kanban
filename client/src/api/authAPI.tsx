// Parameter: Authorization
// Format: Bearer ${token}

import { UserLogin } from "../interfaces/UserLogin";

const login = async (userInfo: UserLogin) => {
	try {
		// Get the API base URL from environment variables
		const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
		console.log('API URL:', apiUrl); // Debug log

		const response = await fetch(
			`${apiUrl}/login`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				body: JSON.stringify(userInfo),
				credentials: 'include'
			}
		);

		console.log('Response status:', response.status); // Debug log

		if (!response.ok) {
			let errorMessage = 'Invalid credentials';
			try {
				const errorData = await response.json();
				errorMessage = errorData.message || errorMessage;
			} catch (e) {
				console.error('Error parsing error response:', e);
			}
			throw new Error(errorMessage);
		}

		const data = await response.json();
		if (!data.token) {
			throw new Error("No token received from server");
		}

		return data;
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
