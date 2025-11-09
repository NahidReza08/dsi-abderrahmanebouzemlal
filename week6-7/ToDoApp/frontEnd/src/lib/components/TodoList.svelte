<script>
// @ts-nocheck
  import { getFilteredTodos, loading, error, todos, todoActions } from '../stores/todoStore.svelte.js';
  import TodoItem from './TodoItem.svelte';
  import LoadingSpinner from './LoadingSpinner.svelte';
  import ErrorMessage from './ErrorMessage.svelte';
  import { send, receive, flipDuration } from '../utils/todoTransitions.js';
  import { flip } from 'svelte/animate';

  let filteredTodos = $derived(getFilteredTodos());
  let mouseYCoordinate = $state(null);
  let distanceTopGrabbedVsPointer = $state(null);
  
  let draggingItemId = $state(null);
  let draggingItemIndex = $state(null);
  let hoveredItemIndex = $state(null);

  async function handleDragEnd() {
    if (draggingItemIndex !== null &&
        hoveredItemIndex !== null &&
        draggingItemIndex !== hoveredItemIndex) {
      
      await todoActions.reorderTodos(hoveredItemIndex, draggingItemIndex);
    }
    
    draggingItemId = null;
    draggingItemIndex = null;
    hoveredItemIndex = null;
    mouseYCoordinate = null;
  }

  function handleDragStart(e, todo, index) {
    e.dataTransfer.setData('text/plain', todo._id);
    e.dataTransfer.effectAllowed = 'move';
    
    mouseYCoordinate = e.clientY;
    draggingItemId = todo._id;
    draggingItemIndex = index;
    distanceTopGrabbedVsPointer = e.currentTarget.getBoundingClientRect().top - e.clientY;
  }

  function handleDragOver(e, index) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    hoveredItemIndex = index;
  }

  function handleDrag(e) {
    mouseYCoordinate = e.clientY;
  }
</script>

<div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
  {#if loading.value}
    <LoadingSpinner message="Loading your tasks..." />
  {:else if error.value}
    <ErrorMessage message={error.value} />
  {:else if filteredTodos.length === 0}
    <div class="text-center py-16">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-4">
        <svg class="w-10 h-10 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
        </svg>
      </div>
      <p class="text-blue-200 text-lg font-medium">
        No tasks yet. Add your first task above!
      </p>
    </div>
  {:else}
    <ul class="space-y-3">
      {#each filteredTodos as todo, index (todo._id)}
        <li
          draggable="true"
          class:opacity-50={draggingItemId === todo._id}
          class:border-blue-400={hoveredItemIndex === index && draggingItemId !== todo._id}
          class:bg-blue-500={hoveredItemIndex === index && draggingItemId !== todo._id}
          in:receive={{ key: todo._id }}
          out:send={{ key: todo._id }}
          animate:flip={{ duration: flipDuration }}
          ondragstart={(e) => handleDragStart(e, todo, index)}
          ondrag={handleDrag}
          ondragover={(e) => handleDragOver(e, index)}
          ondragenter={(e) => e.preventDefault()}
          ondragleave={(e) => e.preventDefault()}
          ondrop={(e) => e.preventDefault()}
          ondragend={handleDragEnd}
        >
          <TodoItem {todo}/>
        </li>
      {/each}
    </ul>
  {/if}
</div>