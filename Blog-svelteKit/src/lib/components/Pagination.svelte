<script>
  let { currentPage = $bindable(), totalPages, goToPage } = $props();
</script>

<div class="flex justify-center gap-2.5 mt-4">
  {#each Array(totalPages) as _, i (i)}
    <button
      class="w-12 h-12 rounded-lg text-base font-medium transition-all focus:outline-none focus:ring-2 focus:ring-gray-300 {i +
      1 ===
      currentPage
        ? 'bg-gray-900 text-white'
        : 'bg-transparent text-gray-900 hover:bg-gray-100'}"
      class:active={i + 1 === currentPage}
      onclick={() => goToPage(i + 1)}
      aria-label="Go to page {i + 1}"
      aria-current={i + 1 === currentPage ? 'page' : undefined}
    >
      {i + 1}
    </button>
  {/each}
</div>