// authStore.js
import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Auth store
export const auth = writable({
	user: null,
	accessToken: null,
	isLoading: true,
	isAuthenticated: false
});

export const user = derived(auth, ($auth) => $auth.user);
export const isAuthenticated = derived(auth, ($auth) => $auth.isAuthenticated);
export const isLoading = derived(auth, ($auth) => $auth.isLoading);

// Modal store
export const authModal = writable({
	isOpen: false,
	type: 'login'
});

// Helper functions
const getStoredAuth = () => {
	if (!browser) return null;

	const token = localStorage.getItem('accessToken');
	const userData = localStorage.getItem('user');

	if (token && userData) {
		try {
			return {
				accessToken: token,
				user: JSON.parse(userData)
			};
		} catch (error) {
			console.error('Error parsing stored user data:', error);
			clearStoredAuth();
		}
	}
	return null;
};

const clearStoredAuth = () => {
	if (browser) {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('user');
	}
};

const storeAuth = (accessToken, user) => {
	if (browser) {
		localStorage.setItem('accessToken', accessToken);
		localStorage.setItem('user', JSON.stringify(user));
	}
};

const updateAuthState = (user, accessToken, isAuthenticated = true) => {
	auth.set({
		user,
		accessToken,
		isLoading: false,
		isAuthenticated
	});
};

// Initialize auth - now only uses localStorage
export function initializeAuth() {
	if (browser) {
		const stored = getStoredAuth();
		if (stored) {
			updateAuthState(stored.user, stored.accessToken, true);
		} else {
			updateAuthState(null, null, false);
		}
	} else {
		// Server-side: always not authenticated
		updateAuthState(null, null, false);
	}
}

// API request helper
async function apiRequest(endpoint, options = {}) {
	const config = {
		headers: {
			'Content-Type': 'application/json',
			...options.headers
		},
		credentials: 'include',
		...options
	};

	// Add authorization header if we have a token
	const currentAuth = get(auth);
	if (currentAuth.accessToken && !config.headers.Authorization) {
		config.headers.Authorization = `Bearer ${currentAuth.accessToken}`;
	}

	try {
		const response = await fetch(`${BACKEND_URL}${endpoint}`, config);

		if (!response.ok) {
			// Handle 401 Unauthorized (token expired)
			if (response.status === 401) {
				console.log('Token expired, attempting refresh...');
				const refreshResult = await attemptTokenRefresh();
				if (refreshResult.success) {
					// Retry the original request with new token
					config.headers.Authorization = `Bearer ${refreshResult.accessToken}`;
					const retryResponse = await fetch(`${BACKEND_URL}${endpoint}`, config);
					if (!retryResponse.ok) {
						throw new Error(`API error: ${retryResponse.status}`);
					}
					return await retryResponse.json();
				} else {
					// Refresh failed, clear auth
					clearAuth();
					throw new Error('Session expired. Please login again.');
				}
			}

			const error = await response.json().catch(() => ({ message: 'Request failed' }));
			throw new Error(error.message || `API error: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error(`API request failed for ${endpoint}:`, error);
		throw error;
	}
}

// Token refresh helper
async function attemptTokenRefresh() {
	try {
		const response = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
			method: 'POST',
			credentials: 'include'
		});

		if (response.ok) {
			const data = await response.json();
			updateAuthState(data.user, data.accessToken, true);
			storeAuth(data.accessToken, data.user);
			return { success: true, accessToken: data.accessToken };
		}
	} catch (error) {
		console.error('Token refresh failed:', error);
	}

	return { success: false };
}

export const authFunctions = {
	async login(email, password) {
		try {
			const data = await apiRequest('/api/auth/login', {
				method: 'POST',
				body: JSON.stringify({ email, password })
			});

			updateAuthState(data.user, data.accessToken, true);
			storeAuth(data.accessToken, data.user);

			authModal.set({ isOpen: false, type: 'login' });

			// Handle redirect if present in URL
			const urlParams = new URLSearchParams(window.location.search);
			const redirect = urlParams.get('redirect');
			if (redirect) {
				await goto(redirect);
			} else {
				// Reload the page to ensure all components get the auth state
				window.location.reload();
			}

			return { success: true, user: data.user };
		} catch (error) {
			console.error('Login error:', error);
			return { success: false, error: error.message };
		}
	},

	async signup(userData) {
		try {
			const data = await apiRequest('/api/auth/signup', {
				method: 'POST',
				body: JSON.stringify(userData)
			});

			updateAuthState(data.user, data.accessToken, true);
			storeAuth(data.accessToken, data.user);

			authModal.set({ isOpen: false, type: 'signup' });

			// Reload after signup to ensure proper state
			window.location.reload();

			return { success: true, user: data.user };
		} catch (error) {
			console.error('Signup error:', error);
			return { success: false, error: error.message };
		}
	},

	async logout() {
		try {
			await apiRequest('/api/auth/logout', {
				method: 'POST'
			});
		} catch (error) {
			console.error('Logout API call failed:', error);
		} finally {
			await clearAuth();
			// Full reload to clear all state
			window.location.href = '/';
		}
	},

	async updateProfile(profileData) {
		try {
			const data = await apiRequest('/api/auth/profile', {
				method: 'PUT',
				body: JSON.stringify(profileData)
			});

			auth.update((state) => ({
				...state,
				user: data.user
			}));

			storeAuth(get(auth).accessToken, data.user);

			return { success: true, user: data.user };
		} catch (error) {
			console.error('Profile update error:', error);
			return { success: false, error: error.message };
		}
	}
};

// Helper to get current access token
export function getAccessToken() {
	return get(auth).accessToken;
}

export async function clearAuth() {
	clearStoredAuth();

	auth.set({
		user: null,
		accessToken: null,
		isLoading: false,
		isAuthenticated: false
	});
}

// Modal functions
export function openLoginModal() {
	authModal.set({ isOpen: true, type: 'login' });
}

export function openSignupModal() {
	authModal.set({ isOpen: true, type: 'signup' });
}

export function closeAuthModal() {
	authModal.set({ isOpen: false, type: 'login' });
}

export function switchAuthModal(type) {
	authModal.set({ isOpen: true, type });
}

// Auto-initialize auth on client side
if (browser) {
	initializeAuth();
}
