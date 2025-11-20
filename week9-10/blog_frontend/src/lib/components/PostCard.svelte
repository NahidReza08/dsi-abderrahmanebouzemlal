<script>
	import { formatDate } from '$lib/utils.js';
	let { post } = $props();
	const formattedDate = formatDate(post.published_at);
</script>

<a href="/blog/{post._id}" class="group">
	<div
		class="flex h-[508px] w-full max-w-[343px] flex-col gap-5 overflow-hidden rounded-xl bg-white shadow-sm transition-shadow group-hover:cursor-pointer group-hover:shadow-md"
	>
		<img
			src={post.featured_image}
			alt={post.title}
			class="h-[240px] w-full rounded-t-xl object-cover transition-transform group-hover:scale-110"
		/>
		<div class="flex flex-1 flex-col gap-2 px-4">
			<div class="flex items-center justify-between text-sm text-gray-500">
				<div class="flex items-center gap-2 font-medium text-gray-900">
					<img
						src={post.author.profile_picture}
						alt={post.author.username}
						class="h-8 w-8 rounded-full object-cover"
					/>
					<span>{post.author.username}</span>
				</div>
				<time datetime={post.published_at}>{formattedDate}</time>
			</div>

			<h2
				class="group-hoverderline m-0 line-clamp-2 text-2xl leading-8 font-medium text-gray-900 group-hover:cursor-pointer"
			>
				{post.title}
			</h2>

			<p class="m-0 line-clamp-3 text-base leading-6 text-gray-700">
				{post.excerpt}
			</p>
		</div>
		<div
			class="mx-4 mb-4 flex w-fit items-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-900 transition-colors group-hover:bg-gray-200"
		>
			Read More
			<span class="font-bold">→</span>
		</div>
	</div>
</a>
