<script lang="js">
	import { formatDate } from '$lib/utils';

	export let title = '';
	export let excerpt = '';
	export let content = '';
	export let author = '';
	export let publishDate = '';
	export let imagePreview = '';

	function stripHtml(html) {
		const div = document.createElement('div');
		div.innerHTML = html;
		return div.textContent || '';
	}

	$: previewText = excerpt || stripHtml(content).slice(0, 150) + '...';
</script>

<section class="rounded-xl bg-white p-6 shadow-sm">
	<h3 class="mb-4 font-semibold text-gray-900">Preview</h3>
	<div class="space-y-4">
		{#if imagePreview}
			<img src={imagePreview} alt="Preview" class="h-48 w-full rounded-lg object-cover" />
		{/if}

		<div>
			<p class="text-xs text-gray-500">{formatDate(publishDate)}</p>
			<h2 class="mt-1 line-clamp-2 text-xl font-bold">{title || 'Your title here'}</h2>
			<p class="mt-2 line-clamp-3 text-sm text-gray-600">{previewText}</p>
		</div>

		{#if author}
			<div class="flex items-center gap-3 border-t pt-4">
				<div class="h-10 w-10 rounded-full bg-gray-200"></div>
				<div>
					<p class="text-sm font-medium">{author}</p>
				</div>
			</div>
		{/if}
	</div>
</section>
