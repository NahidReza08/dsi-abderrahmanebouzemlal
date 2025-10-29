import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  base: "https://abderrahmanebouzemlal.github.io/pomodoro-timer-app",
  plugins: [svelte(), tailwindcss()],
})
