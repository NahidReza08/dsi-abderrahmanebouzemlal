const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export async function load({ fetch }) {
	try {
		const [categoriesRes, tagsRes] = await Promise.all([
			fetch(`${backend}/api/categories`),
			fetch(`${backend}/api/tags`)
		]);

		if (!categoriesRes.ok) {
			const msg =
				categoriesRes.status === 404
					? 'Categories API endpoint not found'
					: `Failed to fetch categories: ${categoriesRes.status}`;
			throw new Error(msg);
		}

		if (!tagsRes.ok) {
			console.warn('Tags failed, continuing with empty trending list');
		}

		const categoriesJson = await categoriesRes.json();
		const categories = [];
		for (const category of categoriesJson) {
			categories.push(category.name);
		}

		const tagsJson = await tagsRes.json();
		const tags = [];
		for (const tag of tagsJson) {
			tags.push(tag.name);
		}

		return {
			categories,
			tags
		};
	} catch (error) {
		console.error('Error fetching categories:', error);

		const errorMessage = error.message.includes('fetch')
			? 'Network error: Could not connect to server'
			: 'Failed to load categories';

		return {
			categories: [],
			tags: [],
			error: errorMessage
		};
	}
}
