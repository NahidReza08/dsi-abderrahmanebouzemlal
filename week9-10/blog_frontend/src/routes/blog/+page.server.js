// Use Vite environment variables
const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export async function load({ fetch }) {
	try {
		const [postRes, trendingRes] = await Promise.all([
			fetch(`${backend}/api/posts`),
			fetch(`${backend}/api/posts/trending`)
		]);

		if (!postRes.ok) {
			const msg =
				postRes.status === 404
					? 'Posts API endpoint not found'
					: `Failed to fetch posts: ${postRes.status}`;
			throw new Error(msg);
		}

		if (!trendingRes.ok) {
			console.warn('Trending posts failed, continuing with empty trending list');
		}

		const posts = await postRes.json();
		const trendingPosts = trendingRes.ok ? await trendingRes.json() : [];

		return {
			posts,
			trendingPosts
		};
	} catch (error) {
		console.error('Error fetching posts:', error);

		const errorMessage = error.message.includes('fetch')
			? 'Network error: Could not connect to server'
			: 'Failed to load posts';

		return {
			posts: [],
			trendingPosts: [],
			error: errorMessage
		};
	}
}
