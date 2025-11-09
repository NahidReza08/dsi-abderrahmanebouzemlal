import { error } from '@sveltejs/kit';
import { blogPosts } from '$lib/data/data.svelte.js';

export function load({ params }) {
	for (let i = 0; i < blogPosts.blog_posts.length; i++) {
		const post = blogPosts.blog_posts[i];

		if (String(post.id) === String(params.slug)) {
			return {
				post
			};
		}
	}
	error(404);
}