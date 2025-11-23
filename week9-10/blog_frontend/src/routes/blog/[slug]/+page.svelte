<script>
	import TrendingPost from '$lib/components/TrendingPost.svelte';
	let { data } = $props();
	const { post, relatedPosts } = data;

	const formattedDate = new Date(post.publish_date).toLocaleDateString('en-MY', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
</script>

<svelte:head>
	<title>{post.title} — La Plume</title>
	<meta name="description" content={post.description} />
	<meta property="og:title" content={post.title} />
	<meta property="og:description" content={post.description} />
	<meta property="og:image" content={post.article_photo || post.featured_image} />
	<meta property="og:type" content="article" />
</svelte:head>

<article class="mx-auto max-w-7xl px-4 py-12 font-body sm:py-16">
	<!-- Breadcrumb -->
	<nav class="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-500">
		<a href="/" class="hover:text-gray-900">Home</a>
		<span>›</span>
		<a href="/blog" class="hover:text-gray-900">Blog</a>
		<span>›</span>
		<span class="font-medium text-gray-900">{post.title}</span>
	</nav>

	<div class="grid gap-8 lg:grid-cols-12 lg:gap-12">
		<!-- ====== MAIN ARTICLE (8–9 columns on desktop) ====== -->
		<main class="space-y-10 lg:col-span-8 xl:col-span-9">
			<!-- Title + Meta -->
			<header>
				<h1
					class="mb-6 font-header text-4xl leading-tight font-black text-gray-900 sm:text-5xl lg:text-6xl"
				>
					{post.title}
				</h1>

				<div class="flex flex-wrap items-center gap-4 text-gray-600">
					<div class="flex items-center gap-3">
						<img
							src={post.author.profile_picture}
							alt={post.author.username}
							class="h-12 w-12 rounded-full object-cover shadow-md ring-2 ring-white"
						/>
						<div>
							<p class="font-semibold text-gray-900">{post.author.username}</p>
							<time class="text-sm">{formattedDate} · {post.read_time_minutes} min read</time>
						</div>
					</div>
					{#if post.featured}
						<span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800"
							>FEATURED</span
						>
					{/if}
				</div>
			</header>

			<!-- Featured Image -->
			{#if post.featured_image}
				<img
					src={post.featured_image}
					alt={post.title}
					class="aspect-video w-full rounded-2xl object-cover shadow-xl sm:aspect-[5/3]"
				/>
			{/if}

			<!-- Article Content -->
			<div class="prose prose-lg max-w-none text-gray-700">
				<p class="lead text-xl font-medium text-gray-800">
					{post.excerpt}
				</p>
				{@html post.content}
			</div>

			<!-- Tags -->
			{#if post.tags?.length}
				<div class="flex flex-wrap gap-3 py-6">
					{#each post.tags as tag}
						<a
							href="/tag/{tag}"
							class="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
						>
							#{tag}
						</a>
					{/each}
				</div>
			{/if}

			<!-- Author Bio -->
			<div
				class="-mx-4 mt-16 rounded-2xl border-t-2 border-gray-100 bg-gray-50/50 p-8 pt-10 sm:mx-0"
			>
				<div class="flex items-start gap-6">
					<img
						src={post.author.profile_picture}
						alt={post.author.username}
						class="h-20 w-20 flex-shrink-0 rounded-full object-cover"
					/>
					<div>
						<h3 class="text-2xl font-bold text-gray-900">{post.author.username}</h3>
						<p class="mt-2 leading-relaxed text-gray-600">
							{post.author.bio || 'Passionate writer at La Plume.'}
						</p>
					</div>
				</div>
			</div>

			<a
				href="/blog"
				class="mt-12 inline-flex items-center gap-2 font-semibold text-indigo-600 hover:text-indigo-800"
			>
				← All Articles
			</a>
		</main>

		<!-- ====== STICKY SIDEBAR (4–3 columns on desktop) ====== -->
		<aside class="lg:col-span-4 xl:col-span-3">
			<div class="sticky top-24 space-y-12">
				<div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
					<h2 class="mb-8 font-header text-3xl font-bold text-gray-900">You Might Also Like</h2>
					<TrendingPost trendingPosts={relatedPosts} />
				</div>

				<!-- Optional: Add newsletter or popular tags here -->
			</div>
		</aside>
	</div>

	<!-- ====== MOBILE-ONLY HORIZONTAL RELATED POSTS (below image) ====== -->
	<section class="scrollbar-hide -mx-4 mt-12 overflow-x-auto px-4 lg:hidden">
		<h2 class="mb-6 px-2 font-header text-3xl font-bold text-gray-900">More to Read</h2>
		<div class="flex snap-x snap-mandatory gap-5">
			{#each relatedPosts.slice(0, 6) as related}
				<a href="/blog/{related.slug}" class="w-80 flex-shrink-0 snap-center">
					<div class="overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-xl">
						<img
							src={related.featured_image}
							alt={related.title}
							class="h-48 w-full object-cover"
						/>
						<div class="p-4">
							<h3 class="line-clamp-2 text-lg font-semibold">{related.title}</h3>
							<p class="mt-2 text-sm text-gray-500">{formattedDate}</p>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</section>
</article>

<style>
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
</style>
