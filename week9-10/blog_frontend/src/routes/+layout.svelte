<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>


<header class="w-full">
	<Header/>
</header>
<main class="w-full min-h-screen">
	<slot />
</main>

<footer class="py-12 px-6 mt-20 w-full">
	<Footer/>
</footer>