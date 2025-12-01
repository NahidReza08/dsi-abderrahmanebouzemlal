import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		proxy: {
			'/uploads': {
				target: 'http://localhost:3000/', // your backend URL
				changeOrigin: true,
				secure: false
			}
		}
	}
});
