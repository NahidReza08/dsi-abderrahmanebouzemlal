// src/routes/+layout.server.js

export function load({ locals }) {
	// Pass the user and accessToken from server to client
	// This data is available to ALL pages in your app
	return {
		user: locals.user || null,
		accessToken: locals.accessToken || null
	};
}