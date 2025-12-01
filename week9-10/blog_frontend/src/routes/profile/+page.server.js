
import { apiGet } from '$lib/api.js';

export async function load({ locals }) {
	try {
		// Fetch all profile data in parallel
		const [
			publishedRes,
			draftsRes,
			historyRes,
			likedRes,
			commentsRes,
			listsRes
		] = await Promise.all([
			apiGet(`/api/users/${locals.user.id}/posts?status=published`, locals.accessToken),
			apiGet(`/api/users/${locals.user.id}/posts?status=draft`, locals.accessToken),
			apiGet(`/api/users/${locals.user.id}/reading-history`, locals.accessToken),
			apiGet(`/api/users/${locals.user.id}/liked-posts`, locals.accessToken),
			apiGet(`/api/users/${locals.user.id}/comments`, locals.accessToken),
			apiGet(`/api/users/${locals.user.id}/reading-lists`, locals.accessToken)
		]);

		// Parse responses, use empty arrays if endpoints don't exist yet
		const publishedPosts = publishedRes.ok ? await publishedRes.json() : [];
		const draftPosts = draftsRes.ok ? await draftsRes.json() : [];
		const readingHistory = historyRes.ok ? await historyRes.json() : [];
		const likedPosts = likedRes.ok ? await likedRes.json() : [];
		const comments = commentsRes.ok ? await commentsRes.json() : [];
		const readingLists = listsRes.ok ? await listsRes.json() : [];

		return {
			user: locals.user,
			publishedPosts,
			draftPosts,
			readingHistory,
			likedPosts,
			comments,
			readingLists
		};
	} catch (error) {
		console.error('Error loading profile data:', error);

		// Return empty data instead of failing
		return {
			user: locals.user,
			publishedPosts: [],
			draftPosts: [],
			readingHistory: [],
			likedPosts: [],
			comments: [],
			readingLists: []
		};
	}
}