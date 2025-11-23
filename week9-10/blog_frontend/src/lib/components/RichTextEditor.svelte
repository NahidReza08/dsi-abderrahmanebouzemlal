<script>
	import { onMount } from 'svelte';
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

	let history = $state([]);
	let historyIndex = $state(-1);
	let isReady = $state(false);

	onMount(() => {
		if (editorElement) {
			editorElement.innerHTML = content || '';
			saveToHistory();
			isReady = true;
		}
	});

	function saveToHistory() {
		const currentContent = editorElement?.innerHTML || '';
		if (historyIndex < history.length - 1) {
			history = history.slice(0, historyIndex + 1);
		}
		history = [...history, currentContent];
		historyIndex = history.length - 1;
		if (history.length > 50) {
			history = history.slice(-50);
			historyIndex = history.length - 1;
		}
	}

	function handleInput() {
		content = editorElement.innerHTML;
		saveToHistory();
	}

	function execCommand(command, value = null) {
		editorElement?.focus();
		document.execCommand(command, false, value);
		content = editorElement.innerHTML;
		saveToHistory();
	}

	function toggleBold() {
		execCommand('bold');
	}

	function toggleItalic() {
		execCommand('italic');
	}

	function setLink() {
		const selection = window.getSelection();
		if (!selection || selection.rangeCount === 0) return;

		const range = selection.getRangeAt(0);
		let url = '';

		// Check if we're inside a link
		let node = range.commonAncestorContainer;
		if (node.nodeType === 3) node = node.parentNode;
		const link = node.closest('a');

		if (link) {
			url = window.prompt('Enter URL:', link.href);
			if (url === null) return;
			if (url === '') {
				const text = link.textContent;
				const textNode = document.createTextNode(text);
				link.parentNode.replaceChild(textNode, link);
			} else {
				link.href = url;
			}
		} else {
			url = window.prompt('Enter URL:', '');
			if (url === null || url === '') return;
			execCommand('createLink', url);
		}

		content = editorElement.innerHTML;
		saveToHistory();
	}

	function toggleBulletList() {
		execCommand('insertUnorderedList');
	}

	function toggleOrderedList() {
		execCommand('insertOrderedList');
	}

	function toggleHeading(level) {
		execCommand('formatBlock', `h${level}`);
	}

	function toggleBlockquote() {
		execCommand('formatBlock', 'blockquote');
	}

	function undo() {
		if (historyIndex > 0) {
			historyIndex--;
			editorElement.innerHTML = history[historyIndex];
			content = editorElement.innerHTML;
		}
	}

	function redo() {
		if (historyIndex < history.length - 1) {
			historyIndex++;
			editorElement.innerHTML = history[historyIndex];
			content = editorElement.innerHTML;
		}
	}

	function isCommandActive(command) {
		try {
			return document.queryCommandState(command);
		} catch {
			return false;
		}
	}

	function isHeadingActive(level) {
		const selection = window.getSelection();
		if (!selection || selection.rangeCount === 0) return false;
		let node = selection.anchorNode;
		while (node && node !== editorElement) {
			if (node.nodeName === `H${level}`) return true;
			node = node.parentNode;
		}
		return false;
	}

	function isBlockquoteActive() {
		const selection = window.getSelection();
		if (!selection || selection.rangeCount === 0) return false;
		let node = selection.anchorNode;
		while (node && node !== editorElement) {
			if (node.nodeName === 'BLOCKQUOTE') return true;
			node = node.parentNode;
		}
		return false;
	}

	const toolbarButtons = [
		{ action: toggleBold, icon: Bold, title: 'Bold', activeCheck: () => isCommandActive('bold') },
		{
			action: toggleItalic,
			icon: Italic,
			title: 'Italic',
			activeCheck: () => isCommandActive('italic')
		},
		{ action: setLink, icon: Link2, title: 'Link', activeCheck: () => false },
		{ divider: true },
		{
			action: toggleBulletList,
			icon: List,
			title: 'Bullet List',
			activeCheck: () => isCommandActive('insertUnorderedList')
		},
		{
			action: toggleOrderedList,
			icon: ListOrdered,
			title: 'Ordered List',
			activeCheck: () => isCommandActive('insertOrderedList')
		},
		{ divider: true },
		{
			action: () => toggleHeading(2),
			icon: Heading2,
			title: 'Heading 2',
			activeCheck: () => isHeadingActive(2)
		},
		{
			action: () => toggleHeading(3),
			icon: Heading3,
			title: 'Heading 3',
			activeCheck: () => isHeadingActive(3)
		},
		{
			action: toggleBlockquote,
			icon: Quote,
			title: 'Quote',
			activeCheck: isBlockquoteActive
		},
		{ divider: true },
		{
			action: undo,
			icon: Undo,
			title: 'Undo',
			disabled: () => historyIndex <= 0
		},
		{
			action: redo,
			icon: Redo,
			title: 'Redo',
			disabled: () => historyIndex >= history.length - 1
		}
	];
</script>

<div class="space-y-0 overflow-hidden rounded-xl bg-white shadow-lg">
	{#if isReady}
		<div
			class="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50 p-3"
		>
			{#each toolbarButtons as button}
				{#if button.divider}
					<div class="mx-1 h-6 w-px bg-gray-300"></div>
				{:else}
					<button
						onclick={button.action}
						disabled={button.disabled?.()}
						class="rounded-lg p-2 transition-all duration-200 hover:scale-105 active:scale-95
							{button.activeCheck?.()
							? 'bg-blue-500 text-white shadow-md hover:bg-blue-600'
							: 'bg-white text-gray-700 shadow-sm hover:bg-gray-100'}
							{button.disabled?.() ? 'cursor-not-allowed opacity-40 hover:scale-100' : ''}"
						title={button.title}
						type="button"
					>
						<svelte:component this={button.icon} size={18} />
					</button>
				{/if}
			{/each}
		</div>
	{:else}
		<div
			class="h-14 animate-pulse border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50"
		></div>
	{/if}

	<div class="relative">
		<div
			bind:this={editorElement}
			contenteditable="true"
			oninput={handleInput}
			class="prose prose-lg min-h-[400px] max-w-none bg-white p-6 transition-colors focus:bg-gray-50/30 focus:outline-none
				{error ? 'ring-2 ring-red-500' : ''}"
		/>

		{#if !isReady}
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
