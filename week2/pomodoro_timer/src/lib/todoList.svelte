<script>
  // @ts-nocheck
  import NewTask from "./newTask.svelte";
  import { faPlus } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import TaskForm from "./taskForm.svelte";
  import { list } from "postcss";
  import { getTimerStore, getSessionStore } from "./stores.svelte";

  let tasksList = $state([
    {
      id: crypto.randomUUID(),
      estimatedPomodoros: 4,
      actualPomodoros: 2,
      title: "Learn Svelte",
      isCompleted: false,
    },
    {
      id: crypto.randomUUID(),
      estimatedPomodoros: 3,
      actualPomodoros: 1,
      title: "Build a Todo App",
      isCompleted: true,
    },
    {
      id: crypto.randomUUID(),
      estimatedPomodoros: 5,
      actualPomodoros: 0,
      title: "Read a Book",
      isCompleted: false,
    },
  ]);

  let selectedTaskObject = $state(null);
  let isCreating = $state(false);
  let currentFilter = $state("all");
  let editingTaskId = $state(null);

  const activeTasks = $derived(tasksList.filter((task) => !task.isCompleted));
  const completedTasks = $derived(tasksList.filter((task) => task.isCompleted));

  const sessionStore = $state(getSessionStore());

  const sessionState = $derived(sessionStore.value);

  function handleTaskSelect(task) {
    sessionStore.setTask(task);
  }

  function handleTaskUpdate(event) {
    event.preventDefault();
    const { id, estimatedPomodoros, isCompleted } = event.detail;

    tasksList = tasksList.map((task) =>
      task.id === id ? { ...task, estimatedPomodoros, isCompleted } : task,
    );
    toggleTaskCreation(false);
    closeAllForms();
  }

  const filteredTasks = $derived.by(() => {
    switch (currentFilter) {
      case "active":
        return activeTasks;
      case "completed":
        return completedTasks;
      default:
        return tasksList;
    }
  });

  const count = $derived.by(() => `${activeTasks.length}`);

  const taskCountText = $derived.by(() => {
    return `${count} item${count === 1 ? "" : "s"} left`;
  });

  let isModifying = $state(false);

  function toggleTaskCreation() {
    isCreating = !isCreating;
    editingTaskId = null;

    if (!isCreating) {
      resetTaskForm();
    }
  }

  function handleToggle(id) {
    tasksList = tasksList.map((task) =>
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task,
    );
  }

  function startEditingTask(taskId) {
    const task = tasksList.find((t) => t.id === taskId);
    if (task) {
      editingTaskId = taskId;
      isCreating = false;
      sessionStore.updateTask(task);
    }
  }

  function resetTaskForm() {
    isModifying = false;
  }

  function closeAllForms() {
    isCreating = false;
    editingTaskId = null;
    resetTaskForm();
  }
  function saveEditedTask() {
    const trimmedText = sessionState.title.trim();
    if (!trimmedText || !editingTaskId) {
      return;
    }

    tasksList = tasksList.map((task) =>
      task.id === editingTaskId
        ? {
            ...task,
            title: trimmedText,
            actualPomodoros: sessionState.actualPomodoros,
            estimatedPomodoros: sessionState.estimatedPomodoros,
          }
        : task,
    );

    closeAllForms();
  }
  function saveNewTask() {
    const trimmedText = sessionState.title.trim();
    if (!trimmedText) {
      return;
    }

    const newTask = {
      ...sessionState,
      title: trimmedText,
      id: crypto.randomUUID(),
    };

    tasksList = [...tasksList, newTask];
    sessionStore.reset();
    toggleTaskCreation();
  }

  function clearCompleted() {
    tasksList = activeTasks;
  }

  function setFilter(filterType) {
    currentFilter = filterType;
  }

  function deleteTask(task) {
    sessionStore.reset();
    if (!task || !task.id) return;
    if (editingTaskId === task.id) {
      closeAllForms();
    }
    if (sessionState.title === task.title) {
      sessionState.clearTask();
    }
    let index = tasksList.findIndex((t) => t.id === task.id);
    tasksList.splice(index, 1);
    closeAllForms();
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    if (editingTaskId) {
      saveEditedTask();
    } else {
      saveNewTask();
    }
  }
</script>

<div
  class="absolute left-1/2 z-50 w-1/3 -translate-x-1/2 -translate-y-20 rounded text-black shadow-2xl"
>
  <div
    class="mb-5 border-b border-gray-300 bg-gradient-to-r from-green-50 via-white to-green-50 p-6 text-center shadow-sm"
  >
    {#if sessionState.id}
      <div class="mb-2 flex items-center justify-center gap-2 shadow-sm shadow-black/10">
        <div class="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
        <span class="text-xs font-semibold tracking-wider text-green-600 uppercase"
          >Currently Working On</span
        >
        <div class="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
      </div>
      <p class="mb-3 text-xl font-bold text-gray-800">{sessionState.title}</p>
      {#if sessionState.estimatedPomodoros > 0}
        <div class="flex items-center justify-center gap-3">
          <div class="rounded-full bg-blue-100 px-3 py-1">
            <p class="text-sm font-medium text-blue-700">
              🍅 {sessionState.actualPomodoros}/{sessionState.estimatedPomodoros} Pomodoros
            </p>
          </div>
          <div class="h-2 w-20 rounded-full bg-gray-200">
            <div
              class="h-2 rounded-full bg-blue-500 transition-all duration-300"
              style="width: {(sessionState.actualPomodoros / sessionState.estimatedPomodoros) *
                100}%"
            ></div>
          </div>
        </div>
      {/if}
    {:else}
      <div class="text-gray-400">
        <div
          class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100"
        >
          <span class="text-2xl">🎯</span>
        </div>
        <p class="text-lg">No task selected</p>
        <p class="mt-1 text-sm">Click on a task to start your focus session</p>
      </div>
    {/if}
  </div>

  <div>
    <div class="flex flex-col">
      <!-- Tasks List - Fixed to pass all required props -->
      {#each filteredTasks as task, i (task.id)}
        <NewTask
          isModifying={editingTaskId === task.id}
          {startEditingTask}
          bind:task={filteredTasks[i]}
          onTaskSelect={handleTaskSelect}
        />
      {/each}

      <!-- Task Creation Form - Fixed form handling and IDs -->
      <TaskForm
        {isCreating}
        isModifying={editingTaskId !== null}
        {handleFormSubmit}
        toggleTaskVisibility={closeAllForms}
        {deleteTask}
        currentTask={editingTaskId ? tasksList.find((t) => t.id === editingTaskId) : null}
      />
      <!-- Create Task Button -->
      <div
        class="group mb-4 flex w-full items-center justify-start gap-2 rounded-md border-2 border-dashed bg-white py-1 transition-colors duration-300 hover:bg-gray-200"
      >
        <button
          onclick={() => {
            toggleTaskCreation();
          }}
          type="button"
          class="flex w-full items-center gap-3 p-3 text-slate-500 hover:cursor-pointer"
        >
          <FontAwesomeIcon
            class="w-6 text-gray-400 transition-transform duration-300 group-hover:rotate-90 hover:cursor-pointer"
            icon={faPlus}
          />
          Create a new todo...
        </button>
      </div>
      {#if tasksList.length > 0}
        <!-- Footer - Fixed to use computed values and working filter buttons -->
        <div
          class="flex items-center justify-between border-t border-gray-300 bg-white p-3 text-sm text-gray-400"
        >
          <!-- Dynamic task count -->
          <p class="hover:text-black">{taskCountText}</p>

          <!-- Working filter buttons -->
          <div class="flex gap-3 text-black">
            <button
              class="border-b-2 transition-colors hover:border-b-2 hover:text-blue-600 {currentFilter ===
              'all'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:border-blue-600'}"
              onclick={() => setFilter("all")}
            >
              All
            </button>
            <button
              d
              class="border-b-2 transition-colors hover:border-b-2 hover:text-blue-600 {currentFilter ===
              'active'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:border-blue-600'}"
              onclick={() => setFilter("active")}
            >
              Active
            </button>
            <button
              class="border-b-2 transition-colors hover:border-b-2 hover:text-blue-600 {currentFilter ===
              'completed'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:border-blue-600'}"
              onclick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>

          <button
            class="disabled:hover:text-gray-400d hover:cursor-pointer hover:text-black disabled:opacity-50 disabled:hover:cursor-not-allowed"
            onclick={clearCompleted}
            disabled={completedTasks.length === 0}
          >
            Clear Completed
          </button>
        </div>
      {:else}
        <div
          class="flex items-center justify-center border-t border-gray-300 bg-white p-3 text-sm text-gray-400"
        >
          <p>No tasks available. Add a new task!</p>
        </div>
      {/if}
    </div>
  </div>
</div>
