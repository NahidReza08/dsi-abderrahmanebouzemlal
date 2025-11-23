<script lang="js">
	import { Tag, X } from 'lucide-svelte';

	let { availableTags = [], selectedTags = [], customTag = '' } = $props();
	async function addCustomTag() {
		const tag = customTag.trim();
		if (tag && !selectedTags.includes(tag)) {
			selectedTags = [...selectedTags, tag];
			try {
				await fetch('http://localhost:3000/api/tags', {
					method: 'POST',
					body: JSON.stringify({ name: tag }),
					headers: { 'Content-Type': 'application/json' }
				});
			} catch (e) {
				console.error(e);
			}
		}
		customTag = '';
	}

	function toggleTag(tag) {
		selectedTags = selectedTags.includes(tag)
			? selectedTags.filter((t) => t !== tag)
			: [...selectedTags, tag];
	}
</script>

<section class="rounded-xl bg-white p-6 shadow-sm">
	<label class="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
		<Tag size={16} /> Tags
	</label>

	{#if selectedTags.length}
		<div class="mb-4 flex flex-wrap gap-2">
			{#each selectedTags as tag}
				<span
					class="inline-flex items-center gap-1 rounded-full bg-gray-900 px-3 py-1 text-sm text-white"
				>
					{tag}
					<button onclick={() => (selectedTags = selectedTags.filter((t) => t !== tag))}>
						<X size={14} />
					</button>
				</span>
			{/each}
		</div>
	{/if}

	<div class="mb-4 max-h-48 space-y-1 overflow-y-auto">
		{#each availableTags as tag}
			<label class="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-gray-50">
				<input
					type="checkbox"
					checked={selectedTags.includes(tag)}
					onchange={() => toggleTag(tag)}
					class="h-4 w-4 rounded text-gray-900"
				/>
				<span class="text-sm">{tag}</span>
			</label>
		{/each}
	</div>

	<div class="flex gap-2">
		<input
			bind:value={customTag}
			onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
			placeholder="Add custom tag"
			class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
		/>
		<button
			onclick={addCustomTag}
			class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-black"
		>
			Add
		</button>
	</div>
</section>
