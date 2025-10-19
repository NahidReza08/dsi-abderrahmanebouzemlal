<script>
  import { icons } from '../utils/icons.js';
  import { projects } from '../data/projects.js';
  import ProjectCard from './ProjectCard.svelte';  
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {#each projects as project, index}
    <ProjectCard {project} {index} />
  {/each}
</div>

{#if projects.length === 0}
  <div class="text-center py-12 animate-fade-in">
    <div class="w-16 h-16 glass bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
      <div class="text-gray-400">{@html icons.search}</div>
    </div>
    <h3 class="text-xl font-semibold text-white mb-2">No projects found</h3>
    <p class="text-gray-400">Try adjusting your search or filter criteria</p>
  </div>
{/if}