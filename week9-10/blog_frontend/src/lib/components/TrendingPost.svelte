<script>
	import { formatDate } from '$lib/utils.js';
	let { featuredPosts = [], trendingPosts } = $props();
	let currentSlide = $state(0);

	const safeFeaturedPosts = $derived(Array.isArray(featuredPosts) ? featuredPosts : []);

	const mostThreeLikedPosts = $derived(safeFeaturedPosts.slice(0, 3));

	const totalSlides = $derived(mostThreeLikedPosts.length);
	const mostLikedPost = $derived(mostThreeLikedPosts[currentSlide] || {});

	function goToSlide(index) {
		if (index >= 0 && index < totalSlides) {
			currentSlide = index;
		}
	}

	function getAuthorName(post) {
		if (!post?.author) return 'Unknown Author';
		return post.author.username || 'Unknown Author';
	}

	function getAuthorPicture(post) {
		return post.author?.profile_picture || '/media/person-icon-1684.jpg';
	}
	function getPostImage(post) {
		return post?.featured_image || '/Image/blog-thumbnail/01.png';
	}
</script>

<aside class="flex w-full max-w-[400px] min-w-[343px] flex-col gap-8 font-body">
	<div class="flex flex-col gap-8">
		<div class="flex flex-col gap-8">
			{#each trendingPosts.slice(0, 3) as post (post._id)}
				{#if post}
					<a href={'/blog/' + post.id}>
						<div class="flex min-h-[150px] gap-4">
							<img
								src={getPostImage(post)}
								alt={post.title || 'Post image'}
								class="h-[150px] w-[150px] flex-shrink-0 rounded-xl object-cover"
							/>

							<div class="flex min-w-0 flex-1 flex-col gap-3">
								<time class="text-sm leading-4 text-gray-900">
									{formatDate(post.published_at)}
								</time>
								<h3 class="m-0 line-clamp-2 text-xl leading-7 font-medium text-gray-900">
									{post.title || 'Untitled Post'}
								</h3>
								<div class="flex items-center gap-2">
									<img
										src={getAuthorPicture(post)}
										alt={getAuthorName(post)}
										class="h-8 w-8 flex-shrink-0 rounded-full object-cover"
									/>
									<span class="truncate text-sm leading-5 font-normal text-gray-900">
										{getAuthorName(post)}
									</span>
								</div>
								<div class="flex gap-2">
									<span class="text-sm leading-4 text-gray-900">Views {post.views}</span>
									<span class="text-sm leading-4 text-gray-900">Likes {post.likes}</span>
								</div>
							</div>
						</div>
					</a>
				{/if}
			{/each}
		</div>
	</div>
	{#if totalSlides > 0}
		<div class="relative w-full overflow-hidden rounded-xl bg-gray-100">
			<img
				src={getPostImage(mostLikedPost)}
				alt={mostLikedPost.title || 'Trending post'}
				class="h-[360px] w-full object-cover"
			/>
			<div
				class="absolute inset-0 z-10 rounded-xl bg-gradient-to-b from-[rgba(15,12,41,0.8)] to-[rgba(48,43,99,0.9)]"
			></div>

			<div class="absolute bottom-5 left-5 z-20 flex max-w-[360px] flex-col gap-3 text-white">
				<time class="text-sm leading-4">
					{formatDate(mostLikedPost.published_at)}
				</time>
				<h3 class="line-clamp-2 text-xl leading-7 font-medium">
					{mostLikedPost.title || 'Trending Post'}
				</h3>
				<div class="flex items-center gap-2">
					<img
						src={getAuthorPicture(mostLikedPost)}
						alt={getAuthorName(mostLikedPost)}
						class="h-8 w-8 rounded-full object-cover"
					/>
					<span class="truncate text-sm">
						{getAuthorName(mostLikedPost)}
					</span>
				</div>
			</div>
		</div>

		{#if totalSlides > 1}
			<div class="flex justify-center gap-4 py-3">
				{#each mostThreeLikedPosts as _, i}
					<button
						class="h-5 w-5 rounded-full transition-colors focus:outline-none {i === currentSlide
							? 'bg-gray-900'
							: 'bg-gray-400 hover:bg-gray-600'}"
						onclick={() => goToSlide(i)}
						onkeydown={(e) => e.key === 'Enter' && goToSlide(i)}
						aria-label={`Go to slide ${i + 1}`}
					/>
				{/each}
			</div>
		{/if}
	{/if}
</aside>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
