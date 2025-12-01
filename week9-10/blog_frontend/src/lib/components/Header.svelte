<script>
	let mobileMenuOpen = $state(false);
	import {
		user,
		isAuthenticated,
		openSignupModal,
		openLoginModal,
		authFunctions
	} from '$lib/data/authStore.js';
	import DropDown from '$lib/components/DropDown.svelte';
</script>

<header class="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between lg:h-20">
			<a href="/" class="group flex items-center gap-3">
				<div class="h-10 w-10 transition-transform group-hover:scale-110 lg:h-12 lg:w-12">
					<img src="/Image/logo.svg" alt="La Plume logo" class="h-full w-full object-contain" />
				</div>
				<h1 class="font-header text-2xl font-black tracking-tight text-gray-900 lg:text-3xl">
					La Plume
				</h1>
			</a>

			<nav class="hidden items-center gap-10 lg:flex">
				<a
					href="/"
					class="relative font-medium text-gray-700 transition after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gray-600 after:transition-all hover:text-gray-600 hover:after:w-full"
				>
					Home
				</a>
				<a
					href="/blog"
					class="relative font-medium text-gray-700 transition after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gray-600 after:transition-all hover:text-gray-600 hover:after:w-full"
				>
					Blog
				</a>
				{#if $isAuthenticated}
					<a
						href="/new-story"
						class="flex items-center gap-2 font-medium text-gray-600 transition hover:text-gray-700"
					>
						<img src="/Image/icons/Edit3.svg" alt="edit" class="h-4 w-4" />
						Write
					</a>
					{#if $user}
						<DropDown user={$user}/>
					{/if}
				{:else}
					<div class="flex gap-4">
						<button
							class="font-medium text-gray-600 transition hover:cursor-pointer hover:text-gray-700"
							onclick={openLoginModal}>Login</button
						>
						<button
							class="rounded-full bg-gray-800 px-4 py-2 font-medium text-white transition hover:cursor-pointer hover:bg-gray-700"
							onclick={() => openSignupModal('signup')}>Sign Up</button
						>
					</div>
				{/if}
			</nav>

			<button
				class="rounded-lg p-2 transition hover:bg-gray-100 lg:hidden"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				aria-label="Toggle menu"
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
					/>
				</svg>
			</button>
		</div>
	</div>

	{#if mobileMenuOpen}
		<div class="border-t border-gray-100 bg-white lg:hidden">
			<nav class="space-y-4 px-4 py-6 text-gray-700">
				<a href="/" class="block py-2 text-lg font-medium text-gray-900">Home</a>
				<a href="/blog" class="block py-2 text-lg font-medium text-gray-900">Blog</a>
				<a href="/new-story" class="block py-2 text-lg font-medium text-gray-900">
					Write a Story
				</a>
			</nav>
		</div>
	{/if}
</header>
