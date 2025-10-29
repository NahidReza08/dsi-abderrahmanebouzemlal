<script>
  // @ts-nocheck
  import { faPlus } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import { getSessionStore } from "./stores.svelte";
  let {
    isCreating,
    deleteTask,
    handleFormSubmit,
    handleTaskUpdate,
    isModifying = $bindable(),
    toggleTaskVisibility,
    isEditing,
  } = $props();

  const sessionStore = $state(getSessionStore());
  const sessionState = $derived(sessionStore.value);

  function clickOutside(element) {
    function handleClick(event) {
      const targetEl = event.target;

      if (element && !element.contains(targetEl)) {
        toggleTaskVisibility();
        isEditing = false;
      }
    }
    document.addEventListener("click", handleClick, true);

    return {
      destroy() {
        document.removeEventListener("click", handleClick, true);
      },
    };
  }
</script>

<form
  use:clickOutside
  class="{isCreating || isModifying
    ? 'block'
    : 'hidden'} flex w-full flex-col gap-3 border-b border-l-4 border-gray-300 border-l-white bg-white p-3 focus-within:border-l-4 hover:cursor-pointer hover:border-l-4 hover:border-l-gray-300"
  onsubmit={handleFormSubmit}
>
  <!-- Task Text Input -->
  <input
    type="text"
    bind:value={sessionState.title}
    class="w-full rounded-t-md border border-gray-300 p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none"
    placeholder="Enter your task..."
    required
  />

  <div class="flex items-center gap-4">
    <label for="actual_pomodoros" class="flex items-center gap-2">
      <span class="text-sm">Actual:</span>
      <input
        type="number"
        bind:value={sessionState.actualPomodoros}
        class="w-16 rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
        placeholder="0"
        min="0"
        id="actual_pomodoros"
      />
    </label>

    <label for="estimated_pomodoros" class="flex items-center gap-2">
      <span class="text-sm">Estimated:</span>
      <input
        type="number"
        bind:value={sessionState.estimatedPomodoros}
        class="w-16 rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
        placeholder="1"
        min="1"
        id="estimated_pomodoros"
      />
    </label>

    <span class="text-sm text-gray-600">Pomodoros</span>
  </div>

  <div class="flex {isModifying ? 'justify-between' : 'justify-end'} gap-3">
    {#if isModifying}
      <button
        type="button"
        onclick={() => {
          deleteTask(sessionState);
          toggleTaskVisibility();
        }}
        class="rounded border bg-white px-3 py-2 hover:cursor-pointer hover:bg-gray-200"
      >
        Delete
      </button>
    {/if}
    <div>
      <button
        type="button"
        onclick={() => {
          toggleTaskVisibility();
          isEditing = false;
        }}
        class="rounded border bg-white px-3 py-2 hover:cursor-pointer hover:bg-gray-200"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="rounded bg-blue-600 px-3 py-2 text-white hover:cursor-pointer hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  </div>
</form>
