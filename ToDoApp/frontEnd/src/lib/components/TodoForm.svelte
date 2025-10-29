<script>
  import { todoActions } from '../stores/todoStore.svelte.js';
  
  let newTodo = $state('');
  
  function handleSubmit(e) {
    e.preventDefault();
    if (newTodo.trim()) {
      todoActions.addTodo(newTodo);
      newTodo = '';
    }
  }
</script>

<div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8 shadow-xl">
  <form onsubmit={(e) => {handleSubmit(e)}} class="flex gap-3">
    <input
      type="text"
      bind:value={newTodo}
      placeholder="What's on your mind?"
      class="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 
      focus:ring-blue-500 focus:border-transparent transition-all"
    />
    <button
      type="submit"
      class="px-8 py-4 bg-blue-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-black-600 
      transition-all duration-200 shadow-lg hover:shadow-xl hover:cursor-pointer transform hover:scale-105 flex items-center gap-2"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
      </svg>
      Add
    </button>
  </form>
</div>