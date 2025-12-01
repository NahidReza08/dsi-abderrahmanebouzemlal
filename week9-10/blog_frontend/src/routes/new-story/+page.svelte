<script lang="js">
	import { formatDate } from '$lib/utils.js';
	import { User, Calendar, FolderOpen, AlertCircle } from 'lucide-svelte';
	import RichTextEditor from '$lib/components/new-story/RichTextEditor.svelte';
	import ImageUploader from '$lib/components/new-story/ImageUploader.svelte';
	import MetaField from '$lib/components/new-story/MetaField.svelte';
	import TagManager from '$lib/components/new-story/TagManager.svelte';
	import PublishPanel from '$lib/components/new-story/PublishPanel.svelte';
	import PostPreview from '$lib/components/new-story/PostPreview.svelte';
	import { clientApiCall } from '$lib/api.js';
	import { onMount } from 'svelte';
	import { isAuthenticated, isLoading } from '$lib/data/authStore.js';
	import { goto } from '$app/navigation';

	onMount(() => {
		if (!$isLoading && !$isAuthenticated) {
			goto('/?login=required&redirect=' + encodeURIComponent(window.location.pathname));
		}
	});

	let data = $props();
	const { categories: availableCategories, tags: availableTags, error } = data.data;
	let title = $state('');
	let content = $state('');
	let excerpt = $state('');
	let author = $state('');
	let publishDate = $state(formatDate(new Date()));
	let category = $state('');
	let selectedTags = $state([]);
	let customTag = $state('');
	let featured_image = $state(null);
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
	async function submitPost(imageFile) {
		try {
			const formData = new FormData();

			formData.append('title', title);
			formData.append('content', content);
			formData.append('excerpt', excerpt);
			formData.append('author', author);
			formData.append('status', 'published');
			formData.append('published_at', publishDate);
			formData.append('category', category);
			formData.append('tags', JSON.stringify(selectedTags));

			if (imageFile) {
				formData.append('featured_image', imageFile);
			}

			// Use clientApiCall with authentication
			const response = await clientApiCall('/api/posts', {
				method: 'POST',
				body: formData,
				headers: {} // Don't set Content-Type, let browser set it for FormData
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Failed to create post');
			}

			return response.json();
		} catch (error) {
			console.error('Error submitting post:', error);
			throw error;
		}
	}

	async function handlePublish() {
		if (!validate()) {
			alert('Please fix errors');
			return;
		}

		isSaving = true;

		try {
			const post = await submitPost(featured_image);
			alert('Published!');
			// Navigate to the new post
			goto(`/blog/${post.slug || post._id || post.id}`);
		} catch (error) {
			alert('Error publishing post: ' + error.message);
		} finally {
			isSaving = false;
		}
	}

	async function handleSaveDraft() {
		if (!validate()) {
			alert('Please fix errors');
			return;
		}

		isSaving = true;

		try {
			const response = await clientApiCall('/api/posts', {
				method: 'POST',
				body: JSON.stringify({
					title,
					content,
					excerpt,
					author,
					status: 'draft',
					published_at: publishDate,
					category,
					tags: selectedTags,
					featured_image: featured_image?.name
				})
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Failed to save draft');
			}

			const data = await response.json();
			alert('Draft saved!');
			goto(`/blog/${data.slug || data._id || data.id}`);
		} catch (error) {
			alert('Error saving draft: ' + error.message);
		} finally {
			isSaving = false;
		}
	}
</script>

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
		<div class="mx-auto max-w-7xl px-4 py-8">
			<header class="mb-8">
				<h1 class="mb-2 text-3xl font-bold text-gray-900">Create New Post</h1>
				<p class="text-gray-600">Write and publish your story</p>
			</header>

			<div class="grid gap-8 lg:grid-cols-[1fr_380px]">
				<div class="space-y-8">
					<section class="rounded-xl bg-white p-6 shadow-sm">
						<label class="mb-3 block text-sm font-semibold text-gray-900" for="post-title">
							>Post Title <span class="text-red-500">*</span></label
						>
						<input
							type="text"
							name="post-title"
							bind:value={title}
							placeholder="Enter an engaging title..."
							maxlength="200"
							class="w-full border-0 border-b-2 text-2xl font-bold {errors.title
								? 'border-red-500'
								: 'border-gray-300'}
                   pb-3 transition-colors focus:border-gray-900 focus:ring-0 focus:outline-none"
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
						bind:imageFile={featured_image}
						bind:preview={imagePreview}
						error={errors.image}
						remove={() => {
							featured_image = null;
							imagePreview = '';
							fileInput.value = '';
						}}
						bind:fileInput
					/>

					<RichTextEditor bind:content bind:editorElement error={errors.content}></RichTextEditor>

					<section class="rounded-xl bg-white p-6 shadow-sm">
						<label class="mb-3 block text-sm font-semibold text-gray-900" for="post-excerpt"
							>Excerpt (Optional)</label
						>
						<textarea
							id="post-excerpt"
							bind:value={excerpt}
							rows="3"
							maxlength="300"
							placeholder="A short summary of your post..."
							class="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-gray-900 focus:outline-none"
						></textarea>
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
{/if}
