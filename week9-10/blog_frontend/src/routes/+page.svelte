<script lang="js">
	const categories = [
		{
			name: 'Technology',
			count: 8,
			description: 'AI, blockchain, and emerging tech',
			color: 'from-blue-500 to-blue-600'
		},
		{
			name: 'Wellness',
			count: 5,
			description: 'Health, mindfulness, and balance',
			color: 'from-green-500 to-green-600'
		},
		{
			name: 'Environment',
			count: 4,
			description: 'Sustainability and climate action',
			color: 'from-emerald-500 to-emerald-600'
		}
	];
</script>

<div class="min-h-screen bg-white">
	<section class="mx-auto max-w-6xl px-6 py-20 md:py-32">
		<div class="max-w-3xl">
			<h1 class="mb-6 text-5xl leading-tight font-bold text-gray-900 md:text-7xl">
				Ideas Worth
				<br />
				Exploring
			</h1>
			<p class="mb-10 text-xl leading-relaxed text-gray-600 md:text-2xl">
				A curated collection of thoughts on technology, design, and the human experience.
			</p>
			<div class="flex flex-wrap gap-4">
				<a
					href="/blog"
					class="inline-flex items-center gap-2 rounded-full bg-gray-900 px-8 py-4 font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-black hover:shadow-lg"
				>
					Read Stories
					<img src="/Image/icons/ArrowRight.svg" alt="arrow right" class="h-4 w-4" />
				</a>
				<a
					href="/new-story"
					class="inline-flex items-center gap-2 rounded-full border-2 border-gray-900 px-8 py-4 font-medium text-gray-900 transition-all hover:bg-gray-50"
				>
					Start Writing
					<img src="/Image/icons/Edit3.svg" alt="edit" class="h-4 w-4" />
				</a>
			</div>
		</div>
	</section>

	<section class="border-y border-gray-200 py-12">
		<div class="mx-auto max-w-6xl px-6">
			<div class="grid grid-cols-2 gap-8 md:grid-cols-4">
				<div class="text-center">
					<div class="mb-2 text-4xl font-bold text-gray-900 md:text-5xl">22</div>
					<div class="text-sm tracking-wider text-gray-600 uppercase">Stories</div>
				</div>
				<div class="text-center">
					<div class="mb-2 text-4xl font-bold text-gray-900 md:text-5xl">6</div>
					<div class="text-sm tracking-wider text-gray-600 uppercase">Authors</div>
				</div>
				<div class="text-center">
					<div class="mb-2 text-4xl font-bold text-gray-900 md:text-5xl">12</div>
					<div class="text-sm tracking-wider text-gray-600 uppercase">Topics</div>
				</div>
				<div class="text-center">
					<div class="mb-2 text-4xl font-bold text-gray-900 md:text-5xl">50K+</div>
					<div class="text-sm tracking-wider text-gray-600 uppercase">Readers</div>
				</div>
			</div>
		</div>
	</section>

	<section class="mx-auto max-w-6xl px-6 py-20">
		<h2 class="mb-12 text-3xl font-bold text-gray-900 md:text-4xl">Explore Topics</h2>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			{#each categories as category (category.name)}
				<a
					href="/blog?category={category.name.toLowerCase()}"
					class="group relative overflow-hidden rounded-2xl bg-gray-100 p-8 transition-all duration-300 hover:shadow-xl"
				>
					<div
						class="absolute inset-0 bg-gradient-to-br {category.color} opacity-0 transition-opacity group-hover:opacity-5"
					></div>
					<div class="relative">
						<h3 class="mb-2 text-2xl font-bold text-gray-900">
							{category.name}
						</h3>
						<p class="mb-4 text-sm text-gray-600">
							{category.description}
						</p>
						<div class="flex items-center justify-between">
							<span class="text-sm text-gray-500">{category.count} articles</span>
							<img
								src="/Image/icons/ArrowRight.svg"
								alt="arrow right"
								class="h-5 w-5 text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-gray-900"
							/>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<section class="bg-gray-50 py-20">
		<div class="mx-auto max-w-6xl px-6">
			<div class="mb-12 flex items-center justify-between">
				<h2 class="text-3xl font-bold text-gray-900 md:text-4xl">Latest Story</h2>
				<a href="/blog" class="group flex items-center gap-2 text-gray-600 hover:text-gray-900">
					View all
					<img
						src="/Image/icons/ArrowRight.svg"
						alt="Arrow Right"
						class=" h-4 w-4 transition-transform group-hover:translate-x-1"
					/>
				</a>
			</div>

			<div class="grid items-center gap-12 md:grid-cols-2">
				<div class="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-200">
					<img
						src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop"
						alt="Latest article"
						class="h-full w-full object-cover"
					/>
				</div>
				<div>
					<div class="mb-4 text-sm tracking-wider text-gray-500 uppercase">
						May 3, 2025 • 11 min read
					</div>
					<h3 class="mb-4 text-3xl leading-tight font-bold text-gray-900 md:text-4xl">
						The Neuroscience of Creativity
					</h3>
					<p class="mb-6 text-lg leading-relaxed text-gray-600">
						Unlocking the brain's creative potential through understanding neural pathways and flow
						states. Discover how modern neuroscience is revealing the secrets behind human
						innovation.
					</p>
					<div class="mb-8 flex items-center gap-4">
						<img
							src="https://i.pravatar.cc/150?img=5"
							alt="Author"
							class="h-12 w-12 rounded-full"
						/>
						<div>
							<div class="font-medium text-gray-900">Aisha Khan</div>
							<div class="text-sm text-gray-600">Clinical Psychologist</div>
						</div>
					</div>
					<a
						href="/blog/20"
						class="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-black"
					>
						Read Article
						<img src="/Image/icons/ArrowRight.svg" alt="Arrow Right" class=" h-4 w-4" />
					</a>
				</div>
			</div>
		</div>
	</section>

	<section class="mx-auto max-w-6xl px-6 py-20">
		<div class="grid gap-12 md:grid-cols-3">
			<div class="text-center">
				<div
					class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100"
				>
					<img src="/Image/icons/BookOpen.svg" alt="book open" class=" h-6 w-6 text-gray-900" />
				</div>
				<h3 class="mb-3 text-xl font-bold text-gray-900">Curated Content</h3>
				<p class="leading-relaxed text-gray-600">
					Every article is carefully selected to provide value, insight, and inspiration.
				</p>
			</div>

			<div class="text-center">
				<div
					class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100"
				>
					<img src="/Image/icons/Users.svg" alt="users" class=" h-6 w-6 text-gray-900" />
				</div>
				<h3 class="mb-3 text-xl font-bold text-gray-900">Expert Authors</h3>
				<p class="leading-relaxed text-gray-600">
					Learn from professionals and thought leaders across diverse fields.
				</p>
			</div>

			<div class="text-center">
				<div
					class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100"
				>
					<img src="/Image/icons/TrendingUp.svg" alt="Trending up" class="h-5 w-5 text-gray-900" />
				</div>
				<h3 class="mb-3 text-xl font-bold text-gray-900">Trending Topics</h3>
				<p class="leading-relaxed text-gray-600">
					Stay updated with the most relevant and timely conversations.
				</p>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="bg-gray-900 py-20 text-white">
		<div class="mx-auto max-w-4xl px-6 text-center">
			<h2 class="mb-6 text-3xl font-bold md:text-5xl">Start Your Journey</h2>
			<p class="mb-10 text-xl text-gray-300">
				Join our community of readers and writers exploring ideas that matter.
			</p>
			<div class="flex flex-wrap justify-center gap-4">
				<a
					href="/blog"
					class="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-medium text-gray-900 transition-all hover:-translate-y-0.5 hover:bg-gray-100"
				>
					Browse Articles
					<img src="/Image/icons/ArrowRight.svg" alt="arrow right" class="h-4 w-4" />
				</a>
				<a
					href="/new-story"
					class="inline-flex items-center gap-2 rounded-full border-2 border-white px-8 py-4 font-medium text-white transition-all hover:bg-white hover:text-gray-900"
				>
					Contribute a Story
				</a>
			</div>
		</div>
	</section>
</div>
