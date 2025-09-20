<script>
// @ts-nocheck
    import { faPlus } from "@fortawesome/free-solid-svg-icons";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    let { isCreating, deleteTask, handleFormSubmit, handleTaskUpdate, isModifying=$bindable(), newTaskForm, toggleTaskVisibility, isEditing} = $props();
    function clickOutside(element){
        function handleClick(event) {
            const targetEl = event.target;

            if (element && !element.contains(targetEl)) {
                toggleTaskVisibility(); isEditing = false;
            }
        }
        document.addEventListener('click', handleClick, true);


        return {
            destroy() {
                document.removeEventListener('click', handleClick, true);
            }
        };
    }
</script>
<form 
    use:clickOutside
    class="{(isCreating || isModifying) ? 'block' : 'hidden'} bg-white border-b border-l-white border-l-4 border-gray-300 w-full p-3 flex flex-col gap-3 hover:cursor-pointer hover:border-l-4 hover:border-l-gray-300 focus-within:border-l-4"
    onsubmit={handleFormSubmit}
>
    <!-- Task Text Input -->
    <input 
        type="text" 
        bind:value={newTaskForm.text} 
        class="w-full border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-t-md" 
        placeholder="Enter your task..."
        required
    />
    
    <div class="flex gap-4 items-center">
        <label for="actual_pomodoros" class="flex items-center gap-2">
            <span class="text-sm">Actual:</span>
            <input 
                type="number" 
                bind:value={newTaskForm.actualPomodoros} 
                class="w-16 border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded" 
                placeholder="0" 
                min="0" 
                id="actual_pomodoros" 
            />
        </label>
        
        <label for="estimated_pomodoros" class="flex items-center gap-2">
            <span class="text-sm">Estimated:</span>
            <input 
                type="number" 
                bind:value={newTaskForm.estimatedPomodoros} 
                class="w-16 border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded" 
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
                deleteTask(newTaskForm);
                toggleTaskVisibility();
            }}
            class="bg-white hover:cursor-pointer hover:bg-gray-200 px-3 py-2 rounded border"
        >
            Delete
        </button>
        {/if}
        <div>
            <button 
                type="button"
                onclick={()=>{toggleTaskVisibility(); isEditing = false;}}
                class="bg-white hover:cursor-pointer hover:bg-gray-200 px-3 py-2 rounded border"
            >
                Cancel
            </button>
            <button 
                type="submit"
                class="hover:cursor-pointer bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded"
            >
                Save
            </button>
        </div>
    </div>
</form>