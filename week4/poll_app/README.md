# Svelte Polling App Front-End

A simple polling app front-end built with **Svelte 5** (no SvelteKit), **Vite**, and **Tailwind CSS v4** (with dark mode support). This project is designed as a learning journey through Svelte 5's core features: stores, lifecycle hooks, transitions, context API, and more.

## Features

- ⚡️ Built with [Svelte 5](https://svelte.dev/blog/svelte-5-beta) and [Vite](https://vitejs.dev/)
- 🎨 Styled with [Tailwind CSS v4](https://tailwindcss.com/) (dark mode supported)
- 🗳️ Polling: Vote for your favorite option and see live results
- 🌗 Light/Dark theme toggle
- 🏪 Svelte 5 stores: `writable`, `derived`, and `$state` rune
- 🔄 Animations & transitions: `fade`, `animate:flip`
- 🧩 Context API: `setContext`, `getContext`
- 🔁 Component communication patterns
- 🚫 No SvelteKit, only Svelte

---

## Learning Roadmap

### Day 1: Svelte Stores

- Learn about `writable`, `readable`, `derived` stores
- Use the `$state` rune for local state management

### Day 2: Lifecycle Hooks & Effects

- Explore `onMount`, `beforeUpdate`, `afterUpdate`, `onDestroy`
- Use the `effect` rune for reactive side effects

### Day 3: Animations & Transitions

- Use built-in transitions: `fade`, `fly`, `slide`
- Animate list reordering with `animate:flip`

### Day 4: Context API & Communication

- Share data/functions with `setContext` and `getContext`
- Practice component communication patterns

### Day 5: Mini Project

- Build a polling app:
  - Users vote for options
  - Live results update
  - Light/dark theme toggle
  - All features above integrated

## Getting Started

1. **Clone the repo:**

   ```bash
   git clone https://github.com/your-username/svelte-poll-app.git
   cd svelte-poll-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the dev server:**

   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```
