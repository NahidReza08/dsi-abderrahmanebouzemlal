<script>
  import { icons } from '../utils/icons.js';
</script>

<header class="glass bg-black/20 border-b border-white/10 animate-slide-up">
  <div class="max-w-7xl mx-auto px-6 py-4">
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div class="flex items-center space-x-4">
        <div class="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center shadow-lg">
          {@html icons.code}
        </div>
        <div>
          <h1 class="text-2xl font-bold text-white">Tailwind × Svelte</h1>
          <p class="text-purple-300 text-sm">Showcase of Beautiful Projects</p>
        </div>
      </div>
    </div>
  </div>
</header>