// Parameter: Authorization
// Format: Bearer ${token}

import { UserLogin } from "../interfaces/UserLogin";

const login = async (userInfo: UserLogin) => {
	try {
		// avoid hardcoding, use VITE env
		const response = await fetch(
			`${import.meta.env.VITE_API_BASE_URL || "/auth"}/login`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userInfo),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Invalid credentials");
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
