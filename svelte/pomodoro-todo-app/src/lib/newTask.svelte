<script>
// @ts-nocheck
import TaskForm from "./taskForm.svelte";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
import {getSessionStore} from "./stores.svelte";

let {
  task = $bindable(), 
  startEditingTask, 
  isModifying, 
  onTaskSelect
} = $props();

const sessionStore = getSessionStore();
let currentTask = '';

const remainingTasks = $derived(sessionStore.value.actualPomodoros - sessionStore.value.estimatedPomodoros);
const progressText = $derived(`${sessionStore.value.actualPomodoros} / ${sessionStore.value.estimatedPomodoros}`);

function toggle() {
  task.isCompleted = !task.isCompleted;
}


function selectTask() {
  sessionStore.setTask(task);
  currentTask = sessionStore.value.title;

  if (onTaskSelect) {
    onTaskSelect(task);
  }
}
const isSelected = $derived(task.title === currentTask);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  onclick={selectTask}
  class="{isModifying ? 'hidden':'block'} bg-white border-b border-gray-300 w-full p-3 flex justify-between items-center hover:cursor-pointer hover:border-l-4 hover:border-l-gray-300 {isSelected ? 'border-l-4 border-l-pinkish bg-green-100' : 'border-l-4 border-l-white'}"
>
  <div class="flex gap-3 items-center mr-3">
    <input
      onchange={toggle}
      id={"task-" + task.id}
      type="checkbox"
      checked={task.isCompleted}
      class="peer cursor-pointer accent-pinkish"
    />
    <label class="flex w-full peer-checked:line-through peer-checked:text-gray-400 cursor-pointer" for="task{task.id}">
      <p class="overflow-x-clip">
        {task.title}
      </p>
    </label>
  </div>
  <div class="flex gap-3 items-center">
    <p class="text-gray-400">{progressText}</p>
    <button
      onclick={() => {startEditingTask(task.id)}}
      class="hover:bg-gray-200 p-1 rounded"
    >
      <FontAwesomeIcon
        class="text-gray-400 w-6 hover:cursor-pointer"
        icon={faPenToSquare}
      />
    </button>
  </div>
</div>