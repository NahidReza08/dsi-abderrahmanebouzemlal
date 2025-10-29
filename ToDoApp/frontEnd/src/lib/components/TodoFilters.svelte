<script>
  import { filter, getCompletedCount, todoActions } from '../stores/todoStore.svelte.js';
  import { FILTERS } from '../utils/constants.js';
  let completedCount = $derived(getCompletedCount());
</script>

<div class="bg-white/10 flex justify-center backdrop-blur-md border border-white/20 rounded-2xl p-6 mt-8 shadow-xl">
  <div class="flex flex-wrap gap-4">
    <button
      onclick={() => todoActions.setFilter(FILTERS.ALL)}
      class="px-6 py-3 rounded-xl font-semibold transition-all duration-200 {filter.value === FILTERS.ALL ? 'bg-blue-500 text-white shadow-lg' : 'bg-white/10 text-blue-200 hover:bg-white/20'}"
    >
      All Tasks
    </button>
    <button
      onclick={() => todoActions.setFilter(FILTERS.ACTIVE)}
      class="px-6 py-3 rounded-xl font-semibold transition-all duration-200 {filter.value === FILTERS.ACTIVE ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg' : 'bg-white/10 text-blue-200 hover:bg-white/20'}"
    >
      Active
    </button>
    <button
      onclick={() => todoActions.setFilter(FILTERS.COMPLETED)}
      class="px-6 py-3 rounded-xl font-semibold transition-all duration-200 {filter.value === FILTERS.COMPLETED ? 'bg-linear-to-r from-green-500 to-emerald-500 text-white shadow-lg' : 'bg-white/10 text-green-200 hover:bg-white/20'}"
    >
      Completed
    </button>
    {#if completedCount > 0}
      <button
        onclick={() => todoActions.clearCompleted()}
        class="ml-auto px-6 py-3 rounded-xl font-semibold bg-red-500/20 text-red-200 hover:bg-red-500/30 transition-all duration-200"
      >
        Clear Completed
      </button>
    {/if}
  </div>
</div>