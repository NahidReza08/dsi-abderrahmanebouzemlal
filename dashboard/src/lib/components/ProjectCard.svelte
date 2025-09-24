<script>
  import { icons } from '../utils/icons.js';
  
  export let project;
  export let index = 0;
</script>

<div class="group glass bg-white/10 rounded-xl overflow-hidden border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover-lift animate-fade-in" style="animation-delay: {index * 0.1}s">
  <div class="relative overflow-hidden">
    <img
      src={project.image}
      alt={project.name}
      class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
    {#if project.featured}
      <div class="absolute top-4 left-4">
        <span class="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-full shadow-lg">
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
<<<<<<< HEAD
      <div class="flex items-center space-x-4 text-sm text-gray-400">
        <div class="flex items-center">
          {@html icons.star}
          <span class="ml-1">{project.stars}</span>
        </div>
        <div class="flex items-center">
          {@html icons.users}
          <span class="ml-1">{project.contributors}</span>
        </div>
      </div>
=======
>>>>>>> main
      <div class="flex space-x-2">
        <button class="p-2 glass bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 hover:scale-110" onclick={() => window.open(project.github)}>
          {@html icons.github}
        </button>
        <button class="p-2 glass bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 hover:scale-110" onclick={() => window.open(project.url )}>
          {@html icons.external}
        </button>
      </div>
    </div>
    
    <div class="mt-4 pt-4 border-t border-white/10">
      <p class="text-xs text-gray-400">Updated {project.lastUpdated}</p>
    </div>
  </div>
</div>