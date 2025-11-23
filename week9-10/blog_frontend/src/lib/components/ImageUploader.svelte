<script lang="js">
	import { AlertCircle, Image, X } from 'lucide-svelte';

	let {
		imageFile = $bindable(),
		preview = $bindable(),
		error = $bindable(),
		fileInput,
		remove
	} = $props();

	function handleUpload(e) {
		const file = e.target.files?.[0] ?? null;
		if (!file) return;

		if (file.size > 5 * 1024 * 1024) {
			error = 'Image must be less than 5MB';
			return;
		}

		error = '';
		imageFile = file;
		const reader = new FileReader();
		reader.onload = () => (preview = reader.result);
		reader.readAsDataURL(file);
	}

	function handleRemove() {
		imageFile = null;
		preview = null;
		error = '';
		if (fileInput) {
			fileInput.value = '';
			fileInput.type = 'file';
			fileInput.accept = 'image/*';
		} else {
			console.error('File input element not found');
		}
		if (remove) {
			remove();
		}
	}
</script>

<label class="mb-3 block text-sm font-semibold text-gray-900"
	>Featured Image <span class="text-red-500">*</span></label
>

{#if !preview}
	<div
		onclick={() => fileInput?.click()}
		class="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-12 text-center transition hover:border-gray-900"
	>
		<Image size={48} class="mx-auto mb-4 text-gray-400" />
		<p class="font-medium">Click to upload</p>
		<p class="text-sm text-gray-500">PNG, JPG up to 5MB</p>
	</div>
{:else}
	<div class="group relative">
		<img src={preview} alt="Featured" class="h-64 w-full rounded-xl object-cover" />
		<button
			onclick={handleRemove}
			type="button"
			class="absolute top-3 right-3 rounded-full bg-white/90 p-2 shadow-lg transition hover:bg-white"
		>
			<X size={20} />
		</button>
	</div>
{/if}

<input bind:this={fileInput} type="file" accept="image/*" onchange={handleUpload} class="hidden" />
{#if error}
	<p class="mt-2 flex items-center gap-1 text-sm text-red-500">
		<AlertCircle size={14} />
		{error}
	</p>
{/if}
