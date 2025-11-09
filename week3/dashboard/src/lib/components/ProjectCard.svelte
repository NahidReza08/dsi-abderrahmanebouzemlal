<script>
  export let project
  export let index = 0
</script>

<div
  class="group glass bg-white/10 rounded-xl overflow-hidden border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover-lift animate-fade-in"
  style="animation-delay: {index * 0.1}s"
>
  <div class="relative overflow-hidden">
    <img
      src={project.image}
      alt={project.name}
      class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
    />
    <div
      class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
    ></div>
    {#if project.featured}
      <div class="absolute top-4 left-4">
        <span
          class="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-full shadow-lg"
        >
          Featured
        </span>
      </div>
    {/if}
  </div>

  <div class="p-6">
    <h3 class="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
      {project.name}
    </h3>
    <p class="text-gray-300 mb-4 text-sm leading-relaxed">
      {project.description}
    </p>

    <div class="flex flex-wrap gap-2 mb-4">
      {#each project.tech as tech}
        <span class="px-2 py-1 bg-white/20 text-white text-xs rounded-md border border-white/10">
          {tech}
        </span>
      {/each}
    </div>

    <div class="flex items-center justify-between">
      <div class="flex space-x-2">
        <button
          class="p-2 glass bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 hover:scale-110"
          aria-label="Open GitHub repository"
          onclick={() => window.open(project.github, '_self')}
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"
            ><path
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            /></svg
          >
        </button>
        <button
          class="p-2 glass bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 hover:scale-110"
          aria-label="Open project website"
          onclick={() => window.open(project.url, '_self')}
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            >
            </path>
          </svg>
        </button>
      </div>
    </div>

    <div class="mt-4 pt-4 border-t border-white/10">
      <p class="text-xs text-gray-400">Updated {project.lastUpdated}</p>
    </div>
  </div>
</div>
