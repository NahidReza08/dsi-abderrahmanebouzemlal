<script lang="js">
	import { formatDate } from '$lib/utils.js';
	import { User, Calendar, FolderOpen, AlertCircle } from 'lucide-svelte';
	import RichTextEditor from '$lib/components/RichTextEditor.svelte';
	import ImageUploader from '$lib/components/ImageUploader.svelte';
	import MetaField from '$lib/components/MetaField.svelte';
	import TagManager from '$lib/components/TagManager.svelte';
	import PublishPanel from '$lib/components/PublishPanel.svelte';
	import PostPreview from '$lib/components/PostPreview.svelte';

	let data = $props();
	const { categories: availableCategories, tags: availableTags, error } = data.data;
	let title = $state('');
	let content = $state('');
	let excerpt = $state('');
	let author = $state('');
	let publishDate = formatDate(new Date());
	let category = $state('');
	let selectedTags = $state([]);
	let customTag = $state('');
	let featuredImage = $state(null);
	let imagePreview = $state('');
	let showPreview = $state(false);
	let isSaving = $state(false);

	let errors = $state({});

	let fileInput = $state(null);
	let editorElement = $state(null);

	const titleLength = $derived(title.length);
	const excerptLength = $derived(excerpt.length);
	const hasErrors = $derived(Object.keys(errors).length > 0);
	function validate() {
		errors = {};
		if (!title.trim()) errors.title = 'Required';
		if (!content.trim()) errors.content = 'Required';
		if (!author.trim()) errors.author = 'Required';
		if (!category) errors.category = 'Required';
		console.log(errors);
		return Object.keys(errors).length === 0;
	}

	async function handlePublish() {
		if (!validate()) return alert('Please fix errors');
		isSaving = true;
		const res = await fetch('http://localhost:3000/api/posts', {
			method: 'POST',
			body: JSON.stringify({
				title,
				content,
				excerpt,
				author,
				status: 'published',
				published_at: publishDate,
				category,
				tags: [...selectedTags],
				featuredImage: featuredImage?.name
			}),
		headers:{
			'Content-Type':'application/json'
		},
		})
		.then((res) => res.json())
		alert('Published!'); //notify user
		isSaving = false;
    window.location.href = `/blog/${data._id || data.id}`;
	}

	async function handleSaveDraft() {
		if (!validate()) return alert('Please fix errors');
		isSaving = true;
		const res = await fetch('http://localhost:3000/api/posts', {
			'POST': JSON.stringify({
				title,
				content,
				excerpt,
				author,
				status: 'draft',
				published_at :publishDate,
				category,
				tags: [...selectedTags],
				featuredImage: featuredImage?.name,
			}),
			'Content-Type': 'application/json',
		})
		.then((res) => res.json())
		isSaving = false;
		alert('Draft saved!'); //notify user
		window.location.href = `/blog/${res.id}`
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-7xl px-4 py-8">
		<header class="mb-8">
			<h1 class="mb-2 text-3xl font-bold text-gray-900">Create New Post</h1>
			<p class="text-gray-600">Write and publish your story</p>
		</header>

		<div class="grid gap-8 lg:grid-cols-[1fr_380px]">
			<div class="space-y-8">
				<section class="rounded-xl bg-white p-6 shadow-sm">
					<label class="mb-3 block text-sm font-semibold text-gray-900"
						>Post Title <span class="text-red-500">*</span></label
					>
					<input
						type="text"
						bind:value={title}
						placeholder="Enter an engaging title..."
						maxlength="200"
						class="w-full border-0 border-b-2 text-2xl font-bold {errors.title
							? 'border-red-500'
							: 'border-gray-300'}
                   pb-3 transition-colors focus:border-gray-900 focus:outline-none focus:ring-0"
					/>
					{#if errors.title}
						<p class="mt-2 flex items-center gap-1 text-sm text-red-500">
							<AlertCircle size={14} />
							{errors.title}
						</p>
					{/if}
					<p class="mt-2 text-xs text-gray-500">{titleLength}/200</p>
				</section>

				<ImageUploader
					bind:imageFile={featuredImage}
					bind:preview={imagePreview}
					error={errors.image}
					remove={() => {
						featuredImage = null;
						imagePreview = '';
						fileInput.value = '';
					}}
					bind:fileInput
				/>

				<RichTextEditor bind:content={content} bind:editorElement error={errors.content} />

				<section class="rounded-xl bg-white p-6 shadow-sm">
					<label class="mb-3 block text-sm font-semibold text-gray-900">Excerpt (Optional)</label>
					<textarea
						bind:value={excerpt}
						rows="3"
						maxlength="300"
						placeholder="A short summary of your post..."
						class="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-gray-900 focus:outline-none"
					/>
					<p class="mt-2 text-xs text-gray-500">{excerptLength}/300</p>
				</section>
			</div>

			<aside class="space-y-6 self-start lg:sticky lg:top-6">
				<PublishPanel
					{isSaving}
					{showPreview}
					{handlePublish}
					{handleSaveDraft}
					togglePreview={() => (showPreview = !showPreview)}
				/>

				<MetaField label="Author" icon={User} required>
					<input
						type="text"
						bind:value={author}
						placeholder="Your name"
						class="w-full border {errors.author
							? 'border-red-500'
							: 'border-gray-300'} rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-900 focus:outline-none"
					/>
					{#if errors.author}<p class="mt-1 text-xs text-red-500">{errors.author}</p>{/if}
				</MetaField>

				<MetaField label="Publish Date" icon={Calendar}>
					<input
						type="date"
						bind:value={publishDate}
						class="w-full rounded-lg border border-gray-300 px-4 py-2"
					/>
				</MetaField>

				<MetaField label="Category" icon={FolderOpen} required>
					<select
						bind:value={category}
						class="w-full border {errors.category
							? 'border-red-500'
							: 'border-gray-300'} rounded-lg px-4 py-2"
					>
						<option value="">Select category</option>
						{#each availableCategories as cat}
							<option value={cat}>{cat}</option>
						{/each}
					</select>
					{#if errors.category}<p class="mt-1 text-xs text-red-500">{errors.category}</p>{/if}
				</MetaField>

				<TagManager {availableTags} bind:selectedTags bind:customTag />

				{#if showPreview}
					<PostPreview {title} {excerpt} {content} {author} {publishDate} {imagePreview} />
				{/if}
			</aside>
		</div>
	</div>
</div>
