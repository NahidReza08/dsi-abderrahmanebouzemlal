<script>
  import { projects } from '../data/projects.js'
  import ProjectCard from './ProjectCard.svelte'
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {#each projects as project, index}
    <ProjectCard {project} {index} />
  {/each}
</div>

{#if projects.length === 0}
  <div class="text-center py-12 animate-fade-in">
    <div
      class="w-16 h-16 glass bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4"
    >
      <div class="text-gray-400">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path></svg
        >
      </div>
    </div>
    <h3 class="text-xl font-semibold text-white mb-2">No projects found</h3>
    <p class="text-gray-400">Try adjusting your search or filter criteria</p>
  </div>
{/if}
