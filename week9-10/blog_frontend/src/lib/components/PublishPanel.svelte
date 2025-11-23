<script lang="js">
	import { Save, Send, Eye } from 'lucide-svelte';
	let { isSaving, showPreview, handlePublish, handleSaveDraft, togglePreview } = $props();
</script>

<section class="rounded-xl bg-white p-6 shadow-sm">
	<h3 class="mb-4 font-semibold text-gray-900">Publish</h3>
	<div class="space-y-3">
		<button
			onclick={handlePublish}
			disabled={isSaving}
			class="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-3 font-semibold text-white transition hover:bg-black disabled:opacity-60"
		>
			<Send size={18} />
			{isSaving ? 'Publishing...' : 'Publish Now'}
		</button>

		<button
			onclick={handleSaveDraft}
			class="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-300 py-3 font-semibold transition hover:border-gray-900 hover:bg-gray-50"
		>
			<Save size={18} />
			Save Draft
		</button>

		<button
			onclick={togglePreview}
			class="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 py-3 font-semibold transition hover:bg-gray-200"
		>
			<Eye size={18} />
			{showPreview ? 'Hide' : 'Show'} Preview
		</button>
	</div>
</section>
