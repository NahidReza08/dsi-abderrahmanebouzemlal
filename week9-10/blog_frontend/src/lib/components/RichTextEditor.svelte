<script lang="js">
	import { onMount } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	import { ListItem } from '@tiptap/extension-list';
	import { TextStyle } from '@tiptap/extension-text-style';
	import { Color } from '@tiptap/extension-color';
	import {
		AlertCircle,
		Bold,
		Italic,
		Link2,
		List,
		ListOrdered,
		Heading2,
		Heading3,
		Undo,
		Redo,
		Quote
	} from 'lucide-svelte';

	let { content = $bindable(), editorElement = $bindable(), error } = $props();

	let editor = $state();
	let editorState = $state(0);
	let canUseEditor = $derived(!!editor);

	onMount(() => {
		editor = new Editor({
			element: editorElement,
			extensions: [
				Color.configure({ types: [TextStyle.name, ListItem.name] }),
				TextStyle.configure({ types: [ListItem.name] }),
				StarterKit,
				Link.configure({
					openOnClick: false,
					HTMLAttributes: {
						class: 'text-blue-600 underline hover:text-blue-800'
					}
				})
			],
			content: content,
			onUpdate: () => {
				editorState++;
			},
			onSelectionUpdate: () => {
				editorState++;
			},
			onTransaction: () => {
				editorState++;
			},
			editorProps: {
				attributes: {
					class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px]'
				}
			}
		});
	});

	function setLink() {
		if (!editor) return;
		const previousUrl = editor.getAttributes('link').href;
		const url = window.prompt('Enter URL:', previousUrl);

		if (url === null) return;

		if (url === '') {
			editor.chain().focus().unsetLink().run();
			return;
		}

		editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
	}

	$effect(() => {
		if (editor && content !== editor.getHTML()) {
			content = editor.getHTML();
			editor.commands.setContent(content);
		}
	});

	const toolbarButtons = [
		{
			action: () => editor?.chain().focus().toggleBold().run(),
			icon: Bold,
			title: 'Bold',
			active: 'bold'
		},
		{
			action: () => editor?.chain().focus().toggleItalic().run(),
			icon: Italic,
			title: 'Italic',
			active: 'italic'
		},
		{ action: setLink, icon: Link2, title: 'Link', active: 'link' },
		{ divider: true },
		{
			action: () => editor?.chain().focus().toggleBulletList().run(),
			icon: List,
			title: 'Bullet List',
			active: 'bulletList'
		},
		{
			action: () => editor?.chain().focus().toggleOrderedList().run(),
			icon: ListOrdered,
			title: 'Ordered List',
			active: 'orderedList'
		},
		{ divider: true },
		{
			action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
			icon: Heading2,
			title: 'Heading 2',
			active: { name: 'heading', attrs: { level: 2 } }
		},
		{
			action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
			icon: Heading3,
			title: 'Heading 3',
			active: { name: 'heading', attrs: { level: 3 } }
		},
		{
			action: () => editor?.chain().focus().toggleBlockquote().run(),
			icon: Quote,
			title: 'Quote',
			active: 'blockquote'
		},
		{ divider: true },
		{
			action: () => editor?.chain().focus().undo().run(),
			icon: Undo,
			title: 'Undo',
			disabled: () => !editor?.can().undo()
		},
		{
			action: () => editor?.chain().focus().redo().run(),
			icon: Redo,
			title: 'Redo',
			disabled: () => !editor?.can().redo()
		}
	];

	function isActive(button) {
		if (!editor) return false;
		if (typeof button.active === 'string') {
			return editor.isActive(button.active);
		}
		if (typeof button.active === 'object') {
			return editor.isActive(button.active.name, button.active.attrs);
		}
		return false;
	}

	function isDisabled(button) {
		if (!button.disabled) return false;
		return button.disabled();
	}
</script>

<div class="space-y-0 overflow-hidden rounded-xl bg-white shadow-lg">
	{#if canUseEditor}
		{#key editorState}
			<div
				class="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50 p-3"
			>
				{#each toolbarButtons as button}
					{#if button.divider}
						<div class="mx-1 h-6 w-px bg-gray-300"></div>
					{:else}
						<button
							onclick={button.action}
							disabled={isDisabled(button)}
							class="rounded-lg p-2 transition-all duration-200 hover:scale-105 active:scale-95
								{isActive(button)
								? 'bg-blue-500 text-white shadow-md hover:bg-blue-600'
								: 'bg-white text-gray-700 shadow-sm hover:bg-gray-100'}
								{isDisabled(button) ? 'cursor-not-allowed opacity-40 hover:scale-100' : ''}"
							title={button.title}
							type="button"
						>
							<svelte:component this={button.icon} size={18} />
						</button>
					{/if}
				{/each}
			</div>
		{/key}
	{:else}
		<div
			class="h-14 animate-pulse border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50"
		></div>
	{/if}

	<div class="relative">
		<div
			bind:this={editorElement}
			class="min-h-[400px] bg-white p-6 transition-colors focus-within:bg-gray-50/30
				{error ? 'ring-2 ring-red-500' : ''}"
		/>

		{#if !canUseEditor}
			<div class="absolute inset-0 flex items-center justify-center bg-gray-50/50">
				<div class="flex items-center gap-2 text-gray-500">
					<div class="h-2 w-2 animate-bounce rounded-full bg-blue-500"></div>
					<div
						class="h-2 w-2 animate-bounce rounded-full bg-blue-500"
						style="animation-delay: 0.1s"
					></div>
					<div
						class="h-2 w-2 animate-bounce rounded-full bg-blue-500"
						style="animation-delay: 0.2s"
					></div>
				</div>
			</div>
		{/if}
	</div>

	{#if error}
		<div class="border-t border-red-200 bg-red-50 px-6 py-3">
			<p class="flex items-center gap-2 text-sm font-medium text-red-600">
				<AlertCircle size={16} />
				{error}
			</p>
		</div>
	{/if}
</div>