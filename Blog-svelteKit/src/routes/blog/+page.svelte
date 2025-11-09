<script>
  import TrendingPost from '$lib/components/TrendingPost.svelte';
  import PostCard from '$lib/components/PostCard.svelte';
  import Pagination from '$lib/components/Pagination.svelte';
  import { blogPosts } from '$lib/data/data.svelte.js';

  const featuredPosts = $derived(blogPosts.blog_posts.filter(post => post.featured));
  const POSTS_PER_PAGE = 4;
  let currentPage = $state(1);

  const totalPages = $derived(Math.ceil(blogPosts.blog_posts.length / POSTS_PER_PAGE));
  const start = $derived((currentPage - 1) * POSTS_PER_PAGE);
  const end = $derived(start + POSTS_PER_PAGE);
  const paginatedPosts = $derived(blogPosts.blog_posts.slice(start, end));

  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
</script>

<main class="flex flex-col items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-body">
  <header class="w-full max-w-5xl mx-auto mb-16 text-left">
    <div class="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start lg:items-start">
      <h1 class="font-header font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight tracking-tighter text-gray-900 max-w-3xl">
        Explore new Articles
      </h1>
      <p class="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-lg mt-4 lg:mt-0">
        Dive into a world of insights, ideas, and inspiration. Stay updated with the latest trends shaping our present and future.
      </p>
    </div>
  </header>

  <article class="w-full max-w-7xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
      <section class="lg:col-span-2">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 auto-rows-fr">
          {#each paginatedPosts as post (post.id)}
            <PostCard {post} />
          {/each}
        </div>

        <div class="mt-12">
          <Pagination {currentPage} {totalPages} {goToPage} />
        </div>
      </section>

      <aside class="lg:col-span-1">
        <div class="sticky top-8 sm:flex sm:justify-center sm:items-center sm:h-full">
          <TrendingPost {featuredPosts} />
        </div>
      </aside>
    </div>
  </article>
</main>