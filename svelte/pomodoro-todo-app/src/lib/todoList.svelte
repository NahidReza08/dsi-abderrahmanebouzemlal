<script>
// @ts-nocheck
import NewTask from "./newTask.svelte";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";

const NEW_TASK = {
    taskNumber: 0,
    estimatedPomodoros: 1,
    actualPomodoros: 0,
    taskText: "New Task",
    isCompleted: false
};

let tasksList = $state([
    { id: 1, taskNumber: 0, estimatedPomodoros: 0, actualPomodoros: 3, taskText: "Learn Svelte", isCompleted: false },
    { id: 2, taskNumber: 1, estimatedPomodoros: 1, actualPomodoros: 2, taskText: "Build Todo App", isCompleted: false}
]);

let isCreating = $state(false);
let currentFilter = $state('all');

let newTaskForm = $state({
    text: '',
    actualPomodoros: 0, 
    estimatedPomodoros: 1,
});
const activeTasks = $derived(tasksList.filter(task => !task.isCompleted));
const completedTasks = $derived(tasksList.filter(task => task.isCompleted));

const filteredTasks = $derived.by(() => {
    switch (currentFilter) {
        case 'active': return activeTasks;
        case 'completed': return completedTasks;
        default: return tasksList;
    }
});

const count = $derived.by(() => `${activeTasks.length}`);

const taskCountText = $derived.by(() => {
    return `${count} item${count === 1 ? '' : 's'} left`;
});
function toggleTaskCreation() {
    isCreating = !isCreating;    
    if (!isCreating) {
        resetTaskForm();
    }
}

function handleToggle(id) {
    tasksList = tasksList.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
}

function resetTaskForm() {
    newTaskForm.text = '';
    newTaskForm.estimatedPomodoros = 1;
    newTaskForm.actualPomodoros = 0;
}

function saveNewTask() {
    const trimmedText = newTaskForm.text.trim();
    if (!trimmedText) {
        return;
    }
    
    const newTask = {
        ...NEW_TASK,
        taskNumber: tasksList.length,
        taskText: trimmedText,
        actualPomodoros: newTaskForm.estimatedPomodoros,
        estimatedPomodoros: newTaskForm.actualPomodoros,
        id: crypto.randomUUID()
    };
    
    tasksList = [...tasksList, newTask];
    toggleTaskCreation();
}

function clearCompleted() {
    tasksList = activeTasks;
}

function handleTaskUpdate(event) {
    const { taskNumber, estimatedPomodoros, isCompleted } = event.detail;

    tasksList = tasksList.map(task => 
        task.taskNumber === taskNumber 
            ? { ...task, estimatedPomodoros, isCompleted }
            : task
    );
}

function setFilter(filterType) {
    currentFilter = filterType;
}

function handleFormSubmit(event) {
    event.preventDefault();
    saveNewTask();
}
</script>

<div class="absolute -translate-y-20 w-1/3 z-50 left-1/2 -translate-x-1/2 shadow-2xl text-black rounded">
    <!-- Create Task Button -->
    <div class="border-dashed border-2 group bg-white w-full mb-4 flex gap-2 py-1 justify-start items-center rounded-md hover:bg-gray-200 transition-colors duration-300">
        <button
            onclick={toggleTaskCreation}
            type="button"
            class="w-full p-3 flex gap-3 text-slate-500 items-center hover:cursor-pointer"
        >
            <FontAwesomeIcon 
                class="text-gray-400 w-6 hover:cursor-pointer group-hover:rotate-90 transition-transform duration-300" 
                icon={faPlus}
            />
            Create a new todo...
        </button>
    </div>
    
    <div>
        <div class="flex flex-col">
            <!-- Tasks List - Fixed to pass all required props -->
            {#each filteredTasks as task, i (task.id)}
                <NewTask 
                    bind:task={filteredTasks[i]}
                />
            {/each}
            
            <!-- Task Creation Form - Fixed form handling and IDs -->
            <form 
                class="{isCreating ? 'block' : 'hidden'} absolute -translate-y-20 z-50 left-1/2 -translate-x-1/2 bg-white border-b border-l-white border-l-4 border-gray-300 w-full p-3 flex flex-col gap-3 hover:cursor-pointer hover:border-l-4 hover:border-l-gray-300 focus-within:border-l-4"
                onsubmit={handleFormSubmit}
            >
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
                
                <div class="flex justify-end gap-3">
                    <button 
                        type="button"
                        onclick={toggleTaskCreation}
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
            </form>
            {#if tasksList.length > 0}
            <!-- Footer - Fixed to use computed values and working filter buttons -->
                <div class="bg-white flex justify-between items-center p-3 text-sm text-gray-400 border-t border-gray-300">
                    <!-- Dynamic task count -->
                    <p class="hover:text-black">{taskCountText}</p>
                    
                    <!-- Working filter buttons -->
                    <div class="flex gap-3 text-black">
                        <button 
                            class="hover:text-blue-600 hover:border-b-2 border-b-2 transition-colors {currentFilter === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:border-blue-600'}"
                            onclick={() => setFilter('all')}
                        >
                            All
                        </button>
                        <button d
                            class="hover:text-blue-600 hover:border-b-2 border-b-2 transition-colors {currentFilter === 'active' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:border-blue-600'}"
                            onclick={() => setFilter('active')}
                        >
                            Active
                        </button>
                        <button 
                            class="hover:text-blue-600 hover:border-b-2 border-b-2 transition-colors {currentFilter === 'completed' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:border-blue-600'}"
                            onclick={() => setFilter('completed')}
                        >
                            Completed
                        </button>
                    </div>
                    
                    <button 
                        class="hover:text-black disabled:opacity-50 hover:cursor-pointer disabled:hover:text-gray-400d disabled:hover:cursor-not-allowed"
                        onclick={clearCompleted}
                        disabled={completedTasks.length === 0}
                    >
                        Clear Completed
                    </button>
                </div>
            {:else}
                <div class="bg-white flex justify-center items-center p-3 text-sm text-gray-400 border-t border-gray-300">
                    <p>No tasks available. Add a new task!</p>
                </div>
            {/if}
        </div>
    </div>
</div>