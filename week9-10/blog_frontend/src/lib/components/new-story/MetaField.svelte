<script lang="js">
	let { label, icon, required = false } = $props();
</script>

<section class="rounded-xl bg-white p-6 shadow-sm">
	<label class="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
		<svelte:component this={icon} size={16} />
		{label}
		{#if required}<span class="text-red-500">*</span>{/if}
	</label>
	<slot />
</section>
