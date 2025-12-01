// src/lib/api.js
import { browser } from '$app/environment';

const BACKEND_URL = 'http://localhost:3000';

/**
 * Makes an authenticated request to your Express API (SERVER-SIDE)
 * Used in +page.server.js files
 * @param {string} endpoint - API endpoint (e.g., '/api/posts')
 * @param {Object} options - Fetch options
 * @param {string} accessToken - JWT access token from event.locals
 */
export async function apiCall(endpoint, options = {}, accessToken = null) {
	const url = `${BACKEND_URL}${endpoint}`;

	const headers = {
		'Content-Type': 'application/json',
		...options.headers
	};

	// Add Authorization header if we have an access token
	if (accessToken) {
		headers['Authorization'] = `Bearer ${accessToken}`;
	}

	const response = await fetch(url, {
		...options,
		headers
	});

	return response;
}

/**
 * Convenience wrapper for GET requests
 */
export async function apiGet(endpoint, accessToken = null) {
	return apiCall(endpoint, { method: 'GET' }, accessToken);
}

/**
 * Convenience wrapper for POST requests
 */
export async function apiPost(endpoint, body, accessToken = null) {
	return apiCall(
		endpoint,
		{
			method: 'POST',
			body: JSON.stringify(body)
		},
		accessToken
	);
}

/**
 * Convenience wrapper for PUT requests
 */
export async function apiPut(endpoint, body, accessToken = null) {
	return apiCall(
		endpoint,
		{
			method: 'PUT',
			body: JSON.stringify(body)
		},
		accessToken
	);
}

/**
 * Convenience wrapper for DELETE requests
 */
export async function apiDelete(endpoint, accessToken = null) {
	return apiCall(endpoint, { method: 'DELETE' }, accessToken);
}

/**
 * CLIENT-SIDE API HELPER
 * Makes authenticated requests from the browser (in +page.svelte files)
 * Automatically gets the access token from localStorage
 */
export async function clientApiCall(endpoint, options = {}) {
	if (!browser) {
		throw new Error('clientApiCall can only be used in the browser');
	}

	const accessToken = localStorage.getItem('accessToken');
	const url = `${BACKEND_URL}${endpoint}`;

	const headers = {
		'Content-Type': 'application/json',
		...options.headers
	};

	if (accessToken) {
		headers['Authorization'] = `Bearer ${accessToken}`;
	}

	return await fetch(url, {
		...options,
		headers,
		credentials: 'include' // Important: sends cookies
	});
}
