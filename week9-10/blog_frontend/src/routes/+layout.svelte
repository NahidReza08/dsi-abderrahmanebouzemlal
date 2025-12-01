<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { initializeAuth, openLoginModal } from '$lib/data/authStore.js';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { isLoading, isAuthenticated } from '$lib/data/authStore.js';
	import AuthForms from '$lib/components/auth/authForms.svelte';

	let { data, children } = $props();

	onMount(() => {
		initializeAuth(data.user, data.accessToken);

		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get('login') === 'required') {
			openLoginModal();

			const newUrl = window.location.pathname;
			window.history.replaceState({}, '', newUrl);
		}
	});

	$effect(() => {
		if (!$isLoading && page.url) {
			checkProtectedRoute(page.url.pathname);
		}
	});

	function checkProtectedRoute(pathname) {
		const protectedRoutes = ['/new-story', '/profile', '/blog'];
		const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

		if (isProtected && !$isAuthenticated) {
			window.location.href = `/?login=required&redirect=${encodeURIComponent(pathname)}`;
		}
	}
</script>

<header class="w-full">
	<Header />
</header>
<main class="min-h-screen w-full">
	{@render children()}
	<AuthForms />
</main>

<footer class="mt-20 w-full px-6 py-12">
	<Footer />
</footer>
