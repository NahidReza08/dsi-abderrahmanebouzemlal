<script>
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
    },
  ];
</script>

<div class="min-h-screen bg-white">
  <section class="max-w-6xl mx-auto px-6 py-20 md:py-32">
    <div class="max-w-3xl">
      <h1 class="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
        Ideas Worth
        <br />
        Exploring
      </h1>
      <p class="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed">
        A curated collection of thoughts on technology, design,
        and the human experience.
      </p>
      <div class="flex flex-wrap gap-4">
        <a
          href="/blog"
          class="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-black transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          Read Stories
          <img src="/Image/icons/ArrowRight.svg" alt="arrow right" class="w-4 h-4" />
        </a>
        <a
          href="/new-story"
          class="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-full font-medium hover:bg-gray-50 transition-all"
        >
          Start Writing
          <img src="/Image/icons/Edit3.svg" alt="edit" class="w-4 h-4" />
        </a>
      </div>
    </div>
  </section>

  <section class="border-y border-gray-200 py-12">
    <div class="max-w-6xl mx-auto px-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div class="text-center">
          <div class="text-4xl md:text-5xl font-bold text-gray-900 mb-2">22</div>
          <div class="text-sm text-gray-600 uppercase tracking-wider">Stories</div>
        </div>
        <div class="text-center">
          <div class="text-4xl md:text-5xl font-bold text-gray-900 mb-2">6</div>
          <div class="text-sm text-gray-600 uppercase tracking-wider">Authors</div>
        </div>
        <div class="text-center">
          <div class="text-4xl md:text-5xl font-bold text-gray-900 mb-2">12</div>
          <div class="text-sm text-gray-600 uppercase tracking-wider">Topics</div>
        </div>
        <div class="text-center">
          <div class="text-4xl md:text-5xl font-bold text-gray-900 mb-2">50K+</div>
          <div class="text-sm text-gray-600 uppercase tracking-wider">Readers</div>
        </div>
      </div>
    </div>
  </section>

  <section class="max-w-6xl mx-auto px-6 py-20">
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
      Explore Topics
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      {#each categories as category (category.name)}
        <a
          href="/blog?category={category.name.toLowerCase()}"
          class="group relative overflow-hidden rounded-2xl bg-gray-100 p-8 hover:shadow-xl transition-all duration-300"
        >
          <div class="absolute inset-0 bg-gradient-to-br {category.color} opacity-0 group-hover:opacity-5 transition-opacity"></div>
          <div class="relative">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">
              {category.name}
            </h3>
            <p class="text-gray-600 text-sm mb-4">
              {category.description}
            </p>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">{category.count} articles</span>
              <img src="/Image/icons/ArrowRight.svg" alt="arrow right"
                class="text-gray-400  w-5 h-5 group-hover:text-gray-900 group-hover:translate-x-1 transition-all"
              />
            </div>
          </div>
        </a>
      {/each}
    </div>
  </section>

  <section class="bg-gray-50 py-20">
    <div class="max-w-6xl mx-auto px-6">
      <div class="flex items-center justify-between mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900">
          Latest Story
        </h2>
        <a
          href="/blog"
          class="text-gray-600 hover:text-gray-900 flex items-center gap-2 group"
        >
          View all
          <img src="/Image/icons/ArrowRight.svg"  alt="Arrow Right" class=" w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div class="rounded-2xl overflow-hidden aspect-[4/3] bg-gray-200">
          <img
            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop"
            alt="Latest article"
            class="w-full h-full object-cover"
          />
        </div>
        <div>
          <div class="text-sm text-gray-500 mb-4 uppercase tracking-wider">
            May 3, 2025 • 11 min read
          </div>
          <h3 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            The Neuroscience of Creativity
          </h3>
          <p class="text-lg text-gray-600 mb-6 leading-relaxed">
            Unlocking the brain's creative potential through understanding neural
            pathways and flow states. Discover how modern neuroscience is revealing
            the secrets behind human innovation.
          </p>
          <div class="flex items-center gap-4 mb-8">
            <img
              src="https://i.pravatar.cc/150?img=5"
              alt="Author"
              class="w-12 h-12 rounded-full"
            />
            <div>
              <div class="font-medium text-gray-900">Aisha Khan</div>
              <div class="text-sm text-gray-600">Clinical Psychologist</div>
            </div>
          </div>
          <a
            href="/blog/20"
            class="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-black transition-all hover:-translate-y-0.5"
          >
            Read Article
          <img src="/Image/icons/ArrowRight.svg"  alt="Arrow Right" class=" w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  </section>

  <section class="max-w-6xl mx-auto px-6 py-20">
    <div class="grid md:grid-cols-3 gap-12">
      <div class="text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <img src="/Image/icons/BookOpen.svg" alt="book open" class=" w-6 h-6 text-gray-900" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-3">
          Curated Content
        </h3>
        <p class="text-gray-600 leading-relaxed">
          Every article is carefully selected to provide value, insight, and inspiration.
        </p>
      </div>

      <div class="text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <img src="/Image/icons/Users.svg" alt="users" class=" w-6 h-6 text-gray-900" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-3">
          Expert Authors
        </h3>
        <p class="text-gray-600 leading-relaxed">
          Learn from professionals and thought leaders across diverse fields.
        </p>
      </div>

      <div class="text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <img src="/Image/icons/TrendingUp.svg" alt="Trending up" class="h-5 w-5 text-gray-900" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-3">
          Trending Topics
        </h3>
        <p class="text-gray-600 leading-relaxed">
          Stay updated with the most relevant and timely conversations.
        </p>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="bg-gray-900 text-white py-20">
    <div class="max-w-4xl mx-auto px-6 text-center">
      <h2 class="text-3xl md:text-5xl font-bold mb-6">
        Start Your Journey
      </h2>
      <p class="text-xl text-gray-300 mb-10">
        Join our community of readers and writers exploring ideas that matter.
      </p>
      <div class="flex flex-wrap gap-4 justify-center">
        <a
          href="/blog"
          class="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-all hover:-translate-y-0.5"
        >
          Browse Articles
          <img src="/Image/icons/ArrowRight.svg" alt="arrow right" class="w-4 h-4" />
        </a>
        <a
          href="/new-story"
          class="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white rounded-full font-medium hover:bg-white hover:text-gray-900 transition-all"
        >
          Contribute a Story
        </a>
      </div>
    </div>
  </section>
</div>