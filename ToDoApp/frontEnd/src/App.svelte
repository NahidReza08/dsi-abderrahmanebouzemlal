<script>
  import { todoActions } from './lib/stores/todoStore.svelte.js';
  import TodoStats from './lib/components/TodoStats.svelte';
  import TodoForm from './lib/components/TodoForm.svelte';
  import TodoList from './lib/components/TodoList.svelte';
  import TodoFilters from './lib/components/TodoFilters.svelte';
  import ProgressBar from './lib/components/ProgressBar.svelte';
  import { getProgress, todos } from './lib/stores/todoStore.svelte.js';
  let progress = $derived(getProgress());

  todoActions.fetchTodos();
</script>

<div class="min-h-screen bg-linear-to-br from-slate-900 via-black-900 to-slate-900 py-12 px-4">
  <div class="max-w-4xl mx-auto">
    <header class="text-center mb-12 fade-in">
        <div class="inline-flex items-center justify-center w-10 h-10 bg-indigo-500 rounded-2xl mb-6 shadow-xl pulse">
            <i class="fas fa-tasks text-white text-xl"></i>
        </div>
        <h1 class="text-3xl font-bold text-white mb-4">ToDo APP</h1>
        <p class="text-indigo-200 text max-w-md mx-auto">Organize your tasks, boost your productivity, and achieve your goals</p>
    </header>

    <TodoStats />
    <TodoForm />
    <TodoList />
    <TodoFilters />
    
    {#if todos.value.length > 0}
      <ProgressBar progress={progress} />
    {/if}
  </div>
</div>

<style>
  .fade-in {
    animation: fadeIn 0.8s ease-out;
  }
  
  .pulse {
    animation: pulse 2s infinite;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
</style>