<script>
  import { BookOpen, FileEdit, Clock, Heart, MessageCircle, Bookmark, Settings } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { isAuthenticated, isLoading } from '$lib/data/authStore.js';
	import { goto } from '$app/navigation';

  let { data } = $props();
  const { user, publishedPosts, draftPosts, readingHistory, likedPosts, comments, readingLists } = data;

  let activeTab = $state('published');
	const tabs = [
    { id: 'published', label: 'Published', icon: BookOpen },
    { id: 'drafts', label: 'Drafts', icon: FileEdit },
    { id: 'history', label: 'Reading History', icon: Clock },
    { id: 'liked', label: 'Liked', icon: Heart },
    { id: 'comments', label: 'Comments', icon: MessageCircle },
    { id: 'lists', label: 'Reading Lists', icon: Bookmark }
  ];

	onMount(() => {
		if (!$isLoading && !$isAuthenticated) {
			goto('/?login=required&redirect=' + encodeURIComponent(window.location.pathname));
		}
	});

</script>

<svelte:head>
  <title>{user.username}'s Profile - La Plume</title>
</svelte:head>
{#if $isLoading}
	<div class="flex min-h-screen items-center justify-center">
		<div>Loading...</div>
	</div>
{:else if !$isAuthenticated}
	<div class="flex min-h-screen items-center justify-center">
		<div>Redirecting to login...</div>
	</div>
{:else}
	<div class="min-h-screen bg-gray-50">
  <!-- Header Banner -->
  <div class="bg-white border-b border-gray-200">
    <div class="max-w-5xl mx-auto px-4 py-12">
      <div class="flex items-start gap-6">
        <img
          src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
          alt={user.username}
          class="w-24 h-24 rounded-full border-4 border-white shadow-lg"
        />
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{user.username}</h1>
          <p class="text-gray-600 mb-4 max-w-2xl">{user.bio || 'Passionate writer at La Plume.'}</p>
          <div class="flex items-center gap-6 text-sm text-gray-600">
            <span>{user.followers || 0} Followers</span>
            <span>{user.following || 0} Following</span>
            <span>Joined {user.joinedDate || 'Recently'}</span>
          </div>
        </div>
        <a
          href="/profile/edit"
          class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition"
        >
          <Settings size={16} />
          <span class="text-sm">Edit Profile</span>
        </a>
      </div>
    </div>
  </div>

  <!-- Tabs -->
  <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
    <div class="max-w-5xl mx-auto px-4">
      <div class="flex gap-8 overflow-x-auto">
        {#each tabs as tab}
          <button
            onclick={() => activeTab = tab.id}
            class="flex items-center gap-2 py-4 border-b-2 transition whitespace-nowrap {activeTab === tab.id
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-600 hover:text-gray-900'}"
          >
            <svelte:component this={tab.icon} size={18} />
            <span class="text-sm font-medium">{tab.label}</span>
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- Content -->
  <div class="max-w-5xl mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-sm p-6 md:p-8">

      {#if activeTab === 'published'}
        <div class="space-y-6">
          {#if publishedPosts.length === 0}
            <p class="text-gray-500 text-center py-8">No published posts yet.</p>
          {:else}
            {#each publishedPosts as post}
              <div class="border-b border-gray-200 pb-6 last:border-0">
                <a href="/blog/{post.slug}" class="block">
                  <h3 class="text-xl font-bold text-gray-900 mb-2 hover:text-gray-600 transition">
                    {post.title}
                  </h3>
                </a>
                <p class="text-gray-600 mb-3">{post.excerpt}</p>
                <div class="flex items-center gap-4 text-sm text-gray-500">
                  <span>{new Date(post.published_at).toLocaleDateString()}</span>
                  <span>·</span>
                  <span>{post.views || 0} views</span>
                  <span>·</span>
                  <span>{post.likes || 0} likes</span>
                </div>
              </div>
            {/each}
          {/if}
        </div>

      {:else if activeTab === 'drafts'}
        <div class="space-y-4">
          {#if draftPosts.length === 0}
            <p class="text-gray-500 text-center py-8">No drafts yet.</p>
          {:else}
            {#each draftPosts as draft}
              <a href="/blog/{draft.slug}/edit" class="block">
                <div class="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                  <h3 class="text-lg font-bold text-gray-900 mb-2">{draft.title}</h3>
                  <div class="flex items-center gap-4 text-sm text-gray-500">
                    <span>Last edited: {new Date(draft.updated_at).toLocaleDateString()}</span>
                    <span>·</span>
                    <span>{draft.wordCount || 0} words</span>
                  </div>
                </div>
              </a>
            {/each}
          {/if}
        </div>

      {:else if activeTab === 'history'}
        <div class="space-y-4">
          {#if readingHistory.length === 0}
            <p class="text-gray-500 text-center py-8">No reading history yet.</p>
          {:else}
            {#each readingHistory as item}
              <div class="border-b border-gray-200 pb-4 last:border-0">
                <a href="/blog/{item.slug}">
                  <h3 class="text-lg font-semibold text-gray-900 mb-1 hover:text-gray-600 transition">
                    {item.title}
                  </h3>
                </a>
                <p class="text-sm text-gray-600 mb-2">by {item.author}</p>
                <div class="flex items-center gap-3">
                  <div class="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-green-600 h-2 rounded-full"
                      style="width: {item.progress || 0}%"
                    ></div>
                  </div>
                  <span class="text-sm text-gray-500">{item.progress || 0}%</span>
                </div>
                <p class="text-xs text-gray-500 mt-2">{new Date(item.readDate).toLocaleDateString()}</p>
              </div>
            {/each}
          {/if}
        </div>

      {:else if activeTab === 'liked'}
        <div class="space-y-4">
          {#if likedPosts.length === 0}
            <p class="text-gray-500 text-center py-8">No liked posts yet.</p>
          {:else}
            {#each likedPosts as post}
              <div class="border-b border-gray-200 pb-4 last:border-0">
                <a href="/blog/{post.slug}">
                  <h3 class="text-lg font-semibold text-gray-900 mb-1 hover:text-gray-600 transition">
                    {post.title}
                  </h3>
                </a>
                <p class="text-sm text-gray-600">by {post.author}</p>
                <p class="text-xs text-gray-500 mt-2">Liked on {new Date(post.likedDate).toLocaleDateString()}</p>
              </div>
            {/each}
          {/if}
        </div>

      {:else if activeTab === 'comments'}
        <div class="space-y-5">
          {#if comments.length === 0}
            <p class="text-gray-500 text-center py-8">No comments yet.</p>
          {:else}
            {#each comments as comment}
              <div class="border-b border-gray-200 pb-5 last:border-0">
                <p class="text-sm text-gray-500 mb-2">
                  On: <a href="/blog/{comment.postSlug}" class="font-semibold text-gray-700 hover:text-gray-900 transition">{comment.postTitle}</a>
                </p>
                <p class="text-gray-800 mb-2">{comment.comment}</p>
                <p class="text-xs text-gray-500">{new Date(comment.date).toLocaleDateString()}</p>
              </div>
            {/each}
          {/if}
        </div>

      {:else if activeTab === 'lists'}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#if readingLists.length === 0}
            <div class="col-span-2">
              <p class="text-gray-500 text-center py-8">No reading lists yet.</p>
            </div>
          {:else}
            {#each readingLists as list}
              <a href="/lists/{list.id}" class="block">
                <div class="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                  <div class="flex items-start justify-between mb-2">
                    <h3 class="text-lg font-bold text-gray-900">{list.name}</h3>
                    <span class="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                      {list.count}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600">{list.description}</p>
                </div>
              </a>
            {/each}
          {/if}
        </div>
      {/if}

    </div>
  </div>
</div>
{/if}