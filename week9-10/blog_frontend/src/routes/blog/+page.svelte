<script lang="js">
	import TrendingPost from '$lib/components/TrendingPost.svelte';
	import PostCard from '$lib/components/PostCard.svelte';
	import Pagination from '$lib/components/Pagination.svelte';

	const data = $props();

	const { posts, trendingPosts, error } = data.data;
	if (error) {
		console.error('Error fetching blog posts:', error);
	}

	const featuredPosts = $derived(posts.filter((post) => post.featured));

	const POSTS_PER_PAGE = 4;
	let currentPage = $state(1);

	const totalPages = $derived(Math.ceil(posts.length / POSTS_PER_PAGE));
	const start = $derived((currentPage - 1) * POSTS_PER_PAGE);
	const end = $derived(start + POSTS_PER_PAGE);
	const paginatedPosts = $derived(posts.slice(start, end));

	function goToPage(page) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
</script>

<svelte:head>
	<title>Blog Posts</title>
</svelte:head>

<main
	class="mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-16 font-body sm:px-6 lg:px-8"
>
	<header class="mx-auto mb-16 w-full max-w-5xl text-left">
		<div class="flex flex-col items-start gap-8 lg:flex-row lg:items-start lg:gap-16">
			<h1
				class="max-w-3xl font-header text-5xl leading-tight font-bold tracking-tighter text-gray-900 sm:text-6xl lg:text-7xl"
			>
				Explore new Articles
			</h1>
			<p class="mt-4 max-w-lg text-lg leading-relaxed text-gray-600 lg:mt-0 lg:text-xl">
				Dive into a world of insights, ideas, and inspiration. Stay updated with the latest trends
				shaping our present and future.
			</p>
		</div>
	</header>
	{#if error}
		<div class="w-full rounded-full bg-red-300 px-8 py-4 text-center text-white">{error}</div>
	{/if}
	<article class="mx-auto w-full max-w-7xl">
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
			<section class="lg:col-span-2">
				<div class="grid auto-rows-fr grid-cols-1 gap-8 sm:grid-cols-2">
					{#each paginatedPosts as post, index (post.id ? `post-${post.id}` : `post-${index}`)}
						<PostCard {post} />
					{/each}
				</div>

				<div class="mt-12">
					<Pagination {currentPage} {totalPages} {goToPage} />
				</div>
			</section>

			<aside class="lg:col-span-1">
				<div class="sticky top-8 sm:flex sm:h-full sm:items-center sm:justify-center">
					<TrendingPost {featuredPosts} {trendingPosts} />
				</div>
			</aside>
		</div>
	</article>
</main>
