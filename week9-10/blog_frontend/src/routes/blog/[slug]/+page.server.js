import { error } from '@sveltejs/kit';

export async function load({ fetch, params }) {
	try {
		const { slug } = params;
		const [postRes, relatedRes] = await Promise.all([
			fetch(`http://localhost:3000/api/posts/${slug}`).then((res) => res.json()),
			fetch(`http://localhost:3000/api/posts/${slug}/related`).then((res) => res.json())
		]);
		if (postRes && relatedRes) return { post: postRes, relatedPosts: relatedRes };
		error(404, 'Post not found');
	} catch (error) {
		console.error('Error fetching post:', error);
		error(error.status || 500, error.message);
		return { error: error.message };
	}
}
