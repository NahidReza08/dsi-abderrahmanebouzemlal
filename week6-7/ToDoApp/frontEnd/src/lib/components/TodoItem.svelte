<script>
  import { editingId, editText, todoActions } from '../stores/todoStore.svelte.js';
  
  let { todo } = $props();
  let isEditing = $derived(editingId.value === todo._id);

  function handleEditSubmit(e) {
    e.preventDefault();
    todoActions.updateTodo(todo._id, { text: editText.value.trim() });
  }

  function handleCancelEdit() {
    todoActions.cancelEdit();
  }

  function handleStartEdit() {
    todoActions.setEditing(todo._id, todo.text);
  }
</script>

<li
  class="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all duration-200 hover:shadow-lg"
>
  {#if isEditing}
    <form onsubmit={(e) => {handleEditSubmit(e);}} class="flex gap-2">
      <input
        type="text"
        bind:value={editText.value}
        class="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        Save
      </button>
      <button
        type="button"
        onclick={handleCancelEdit}
        class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
      >
        Cancel
      </button>
    </form>
  {:else}
    <div class="flex items-center gap-4">
      <button
        onclick={() => todoActions.toggleTodo(todo._id)}
        class="shrink-0 w-6 h-6 rounded-lg border-2 transition-all duration-200 {todo.completed ? 'bg-linear-to-br from-green-500 to-emerald-500 border-green-500' : 'border-blue-300 hover:border-blue-400'} flex items-center justify-center"
      >
        {#if todo.completed}
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
          </svg>
        {/if}
      </button>
      
      <span class="flex-1 text-lg {todo.completed ? 'line-through text-blue-300' : 'text-white'} transition-all cursor-grab">
        {todo.text}
      </span>
      
      <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onclick={handleStartEdit}
          class="p-2 text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
          title="Edit"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
        </button>
        <button
          onclick={() => todoActions.deleteTodo(todo._id)}
          class="p-2 text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
          title="Delete"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      </div>
    </div>
  {/if}
</li>