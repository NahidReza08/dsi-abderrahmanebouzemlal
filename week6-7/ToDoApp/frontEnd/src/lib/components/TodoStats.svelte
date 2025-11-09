<script>
  import { todos, getActiveCount, getCompletedCount } from '../stores/todoStore.svelte.js';
  let activeCount = $derived(getActiveCount());
  let completedCount = $derived(getCompletedCount());
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
  <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-blue-200 text-sm font-medium mb-1">Total Tasks</p>
        <p class="text-2xl font-bold text-white">{todos.value.length}</p>
      </div>
      <div class="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center">
        <svg class="w-7 h-7 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      </div>
    </div>
  </div>

  <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-blue-200 text-sm font-medium mb-1">Active</p>
        <p class="text-2xl font-bold text-white">{activeCount}</p>
      </div>
      <div class="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center">
        <svg class="w-7 h-7 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
    </div>
  </div>

  <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-green-200 text-sm font-medium mb-1">Completed</p>
        <p class="text-2xl font-bold text-white">{completedCount}</p>
      </div>
      <div class="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center">
        <svg class="w-7 h-7 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
    </div>
  </div>
</div>