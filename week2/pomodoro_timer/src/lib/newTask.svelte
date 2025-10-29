<script>
  // @ts-nocheck
  import TaskForm from "./taskForm.svelte";
  import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import { getSessionStore } from "./stores.svelte";
  import { faCheck, faPlay } from "@fortawesome/free-solid-svg-icons";

  let { task = $bindable(), startEditingTask, isModifying, onTaskSelect } = $props();

  const sessionStore = getSessionStore();
  let currentTask = "";

  const remainingTasks = $derived(task.actualPomodoros - task.estimatedPomodoros);
  const progressText = $derived(`${task.actualPomodoros} / ${task .estimatedPomodoros}`);

  function toggle() {
    task.isCompleted = !task.isCompleted;

    if (task.isCompleted && task.title === sessionStore.value.title) {
      sessionStore.setTask({ title: "", id: null });
      currentTask = "";
      isSelected = false;
    }
  }

  function selectTask() {
    sessionStore.setTask(task);
    currentTask = sessionStore.value.title;

    if (onTaskSelect) {
      onTaskSelect(task);
    }
  }
  let isSelected = $derived(task.title === sessionStore.value.title);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  onclick={selectTask}
  class="{isModifying
    ? 'hidden'
    : 'block'} flex w-full items-center justify-between border-b border-gray-300 bg-white p-3 shadow-sm shadow-black/10 hover:cursor-pointer hover:border-l-4 hover:border-l-gray-300 {isSelected
    ? 'border-l-pinkish border-l-4 bg-green-100'
    : 'border-l-4 border-l-white'}"
>
  <div class="mr-3 flex items-center gap-3">
    <!-- Selection indicator -->
    {#if isSelected}
      <div
        class="bg-pinkish flex h-6 w-6 animate-pulse items-center justify-center rounded-full text-sm text-white"
      >
        <FontAwesomeIcon icon={faPlay} class="h-3 w-3" />
      </div>
    {/if}
    <input
      onchange={toggle}
      id={"task-" + task.id}
      type="checkbox"
      checked={task.isCompleted}
      class="peer accent-pinkish cursor-pointer"
    />
    <label
      class="flex w-full cursor-pointer peer-checked:text-gray-400 peer-checked:line-through"
      for="task{task.id}"
    >
      <p class="overflow-x-clip">
        {task.title}
      </p>
    </label>
  </div>
  <div class="flex items-center gap-3">
    <p class="text-gray-400">{progressText}</p>
    <button
      onclick={() => {
        startEditingTask(task.id);
      }}
      class="rounded p-1 hover:bg-gray-200"
    >
      <FontAwesomeIcon class="w-6 text-gray-400 hover:cursor-pointer" icon={faPenToSquare} />
    </button>
  </div>
</div>
