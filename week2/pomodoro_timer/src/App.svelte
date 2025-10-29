<script>
  // @ts-nocheck
  import { initStores } from "./lib/stores.svelte";
  import Counter from "./lib/counter.svelte";
  import TodoList from "./lib/todoList.svelte";
  const { tasksStore, timerStore } = initStores();
</script>

<div>
  <Counter />
  <TodoList />
</div>
