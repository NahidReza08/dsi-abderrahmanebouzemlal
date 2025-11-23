<script>
  let { post } = $props();
  const formattedDate = post.publish_date.split('T')[0];
</script>
<a href="/blog/{post.id}" class="group">
	<div class="flex flex-col gap-5 w-full max-w-[343px] h-[508px] bg-white rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow group-hover:cursor-pointer">
		<img
			src={post.article_photo}
			alt={post.title}
			class="w-full h-[240px] object-cover rounded-t-xl group-hover:scale-110 transition-transform"
		/>
		<div class="flex flex-col gap-2 flex-1 px-4">
			<div class="flex justify-between items-center text-sm text-gray-500">
				<div class="flex items-center gap-2 text-gray-900 font-medium">
					<img
						src={post.author.picture}
						alt={post.author.name}
						class="w-8 h-8 rounded-full object-cover"
					/>
					<span>{post.author.name}</span>
				</div>
				<time datetime={post.publish_date}>{formattedDate}</time>
			</div>


				<h2 class="font-medium text-2xl leading-8 group-hover:underline group-hover:cursor-pointer text-gray-900 m-0 line-clamp-2">
					{post.title}
				</h2>

			<p class="text-base leading-6 text-gray-700 m-0 line-clamp-3">
				{post.description}
			</p>
		</div>
		<div
			class="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-900 font-medium text-sm rounded-lg w-fit mx-4 mb-4 transition-colors group-hover:bg-gray-200"
		>
			Read More
			<span class="font-bold">→</span>
		</div>
	</div>
</a>
