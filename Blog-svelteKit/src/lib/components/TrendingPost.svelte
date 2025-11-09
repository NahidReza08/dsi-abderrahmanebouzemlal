<script>
  let { featuredPosts } = $props();
  let currentSlide = $state(0);
  const totalSlides = 3;

  let mostThreeLikedPosts = $derived(
    featuredPosts
      .sort((a, b) => (b.likes || 0) - (a.likes || 0))
      .slice(0, 3)
  );
  let mostLikedPost = $derived(mostThreeLikedPosts[currentSlide]);

  function goToSlide(index) {
    currentSlide = index;
  }

  // Format date
  function formatDate(dateStr) {
    return dateStr.split('T')[0];
  }
</script>

<aside class="flex flex-col gap-8 w-full max-w-[400px] min-w-[343px] h-[1048px] font-montserrat">
  <!-- Trending Posts List -->
  <div class="flex flex-col gap-8 h-[578px]">
    <h1 class="font-semibold text-2xl leading-8 text-gray-900 m-0">Trending Post</h1>

    <div class="flex flex-col gap-8 h-[514px]">
      {#each featuredPosts.slice(0, 3) as post (post.id)}
        <div class="flex gap-4 h-[150px]">
          <!-- Image -->
          <img
            src={post.article_photo}
            alt={post.title}
            class="w-[150px] h-[150px] object-cover rounded-xl flex-shrink-0"
          />

          <!-- Details -->
          <div class="flex flex-col gap-3 w-[234px] h-[136px]">
            <time class="text-sm leading-4 text-gray-900">{formatDate(post.publish_date)}</time>
            <h3 class="font-medium text-xl leading-8 text-gray-900 m-0 line-clamp-2">
              {post.title}
            </h3>
            <div class="flex items-center gap-2">
              <img
                src={post.author.picture}
                alt={post.author.name}
                class="w-8 h-8 rounded-full object-cover"
              />
              <h3 class="font-normal text-sm leading-5 text-gray-900 m-0">{post.author.name}</h3>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Featured Large Card -->
  <div class="relative w-full h-[438px] rounded-xl overflow-hidden">
    <img
      src={mostLikedPost.article_photo}
      alt={mostLikedPost.title}
      class="w-full h-[360px] object-cover"
    />
    <!-- Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-b from-[rgba(15,12,41,0.8)] to-[rgba(48,43,99,0.9)] rounded-xl z-10"></div>

    <!-- Content -->
    <div class="absolute bottom-5 left-5 z-20 w-[360px] text-white flex flex-col gap-3">
      <time class="text-sm leading-4">{formatDate(mostLikedPost.publish_date)}</time>
      <h3 class="font-medium text-xl leading-8 line-clamp-2">{mostLikedPost.title}</h3>
      <div class="flex items-center gap-2">
        <img
          src={mostLikedPost.author.picture}
          alt={mostLikedPost.author.name}
          class="w-8 h-8 rounded-full object-cover"
        />
        <h3 class="font-normal text-sm leading-5 m-0">{mostLikedPost.author.name}</h3>
      </div>
    </div>
  </div>

  <!-- Slide Indicators -->
  <div class="flex justify-center gap-4 px-4 py-2.5">
    {#each Array(totalSlides) as _, i (i)}
      <button
        class="w-5 h-5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 {i === currentSlide
          ? 'bg-gray-900'
          : 'bg-gray-400 hover:bg-gray-600'}"
        class:active={i === currentSlide}
        onclick={() => goToSlide(i)}
        onkeydown={(e) => e.key === 'Enter' && goToSlide(i)}
        aria-label={`Go to slide ${i + 1}`}
        tabindex="0"
      ></button>
    {/each}
  </div>
</aside>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap');
  .font-montserrat { font-family: 'Montserrat', sans-serif; }
</style>