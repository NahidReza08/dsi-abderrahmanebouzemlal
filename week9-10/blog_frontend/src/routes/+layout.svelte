<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<header class="w-full">
	<Header />
</header>
<main class="min-h-screen w-full">
	<slot />
</main>

<footer class="mt-20 w-full px-6 py-12">
	<Footer />
</footer>
