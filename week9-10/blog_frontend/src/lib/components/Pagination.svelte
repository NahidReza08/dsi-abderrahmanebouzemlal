<script>
	let { currentPage = $bindable(), totalPages, goToPage } = $props();
</script>

<div class="mt-4 flex justify-center gap-2.5">
	{#each Array(totalPages) as _, i (i)}
		<button
			class="h-12 w-12 rounded-lg text-base font-medium transition-all focus:ring-2 focus:ring-gray-300 focus:outline-none {i +
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
