<script>
    // @ts-nocheck
    import NewTask from "./newTask.svelte";
    import { faPlus } from "@fortawesome/free-solid-svg-icons";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import TaskForm from "./taskForm.svelte";
    import { list } from "postcss";
    import { getTimerStore, getSessionStore } from "./stores.svelte";


    const NEW_TASK = {
        id: '',
        estimatedPomodoros: 1,
        actualPomodoros: 0,
        title: '',
        isCompleted: false
    };

    let tasksList = $state([
        {
            id: crypto.randomUUID(),
            estimatedPomodoros: 4,
            actualPomodoros: 2,
            title: "Learn Svelte",
            isCompleted: false
        },
        {
            id: crypto.randomUUID(),
            estimatedPomodoros: 3,
            actualPomodoros: 1,
            title: "Build a Todo App",
            isCompleted: true
        },
        {
            id: crypto.randomUUID(),
            estimatedPomodoros: 5,
            actualPomodoros: 0,
            title: "Read a Book",
            isCompleted: false
        }
    ]);

    let selectedTaskObject = $state(null);
    let isCreating = $state(false);
    let currentFilter = $state('all');
    let editingTaskId = $state(null);

    let newTaskForm = $state({
        title: '',
        actualPomodoros: 0, 
        estimatedPomodoros: 1,
    });

    const activeTasks = $derived(tasksList.filter(task => !task.isCompleted));
    const completedTasks = $derived(tasksList.filter(task => task.isCompleted));

    const sessionStore = $state(getSessionStore());

    const sessionState = $derived(sessionStore.value); 


    function handleTaskSelect(task) {
        sessionStore.setTask(task);
    }

    function handleTaskUpdate(event) {
        event.preventDefault();
        const { id, estimatedPomodoros, isCompleted } = event.detail;

        tasksList = tasksList.map(task => 
            task.id === id 
                ? { ...task, estimatedPomodoros, isCompleted }
                : task
        );
        toggleTaskCreation(false);
        closeAllForms();
    }

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

    let isModifying = $state(false);

    function toggleTaskCreation() {
        isCreating = !isCreating;
        editingTaskId = null;
        
        if (!isCreating) {
            resetTaskForm();
        }
    }

    function handleToggle(id) {
        tasksList = tasksList.map(task => 
            task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
        );
    }

    function startEditingTask(taskId) {
        const task = tasksList.find(t => t.id === taskId);
        if (task) {
            editingTaskId = taskId;
            isCreating = false;
            newTaskForm.title = task.title;
            newTaskForm.actualPomodoros = task.actualPomodoros;
            newTaskForm.estimatedPomodoros = task.estimatedPomodoros;
        }
    }

    function resetTaskForm() {
        newTaskForm.title = '';
        newTaskForm.estimatedPomodoros = 1;
        newTaskForm.actualPomodoros = 0;
    }

    function closeAllForms() {
        isCreating = false;
        editingTaskId = null;
        resetTaskForm();
    }
    function saveEditedTask() {
        const trimmedText = newTaskForm.title.trim();
        if (!trimmedText || !editingTaskId) {
            return;
        }
        
        tasksList = tasksList.map(task => 
            task.id === editingTaskId 
                ? { 
                    ...task, 
                    title: trimmedText,
                    actualPomodoros: newTaskForm.actualPomodoros,
                    estimatedPomodoros: newTaskForm.estimatedPomodoros
                }
                : task
        );
        
        closeAllForms();
    }
    function saveNewTask() {
        const trimmedText = newTaskForm.title.trim();
            if (!trimmedText) {
                return;
        }
        
        const newTask = {
            ...NEW_TASK,
            title: trimmedText,
            actualPomodoros: newTaskForm.actualPomodoros,
            estimatedPomodoros: newTaskForm.estimatedPomodoros,
            id: crypto.randomUUID()
        };
        
        tasksList = [...tasksList, newTask];
        toggleTaskCreation();
    }

    function clearCompleted() {
        tasksList = activeTasks;
    }

    function setFilter(filterType) {
        currentFilter = filterType;
    }

    function deleteTask (task) {
        if (!task || !task.id) return;
        if (editingTaskId === task.id) {
            closeAllForms();
        }
        if (sessionState.title === task.title) {
            sessionState.clearTask();
        }
        let index = tasksList.findIndex(t => t.id === task.id);
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

<div class="absolute -translate-y-20 w-1/3 z-50 left-1/2 -translate-x-1/2 shadow-2xl text-black rounded">
    {#if sessionState.id}
        <div class="bg-white text-center text-lg font-bold p-4 border-b border-gray-300 mb-5">
            <p>{ sessionState.title }</p>
            {#if sessionState.estimatedPomodoros > 0}
            <p class="text-xs text-blue-500 mt-1">
            Progress: {sessionState.actualPomodoros}/{sessionState.estimatedPomodoros} Pomodoros
            </p>
        {/if}
        </div>
    {/if}
    
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
                isCreating={isCreating}
                isModifying={editingTaskId !== null}
                bind:newTaskForm
                {handleFormSubmit}
                toggleTaskVisibility={closeAllForms}
                {deleteTask}
                currentTask={editingTaskId ? tasksList.find(t => t.id === editingTaskId) : null}
            />
            <!-- Create Task Button -->
            <div class="border-dashed border-2 group bg-white w-full mb-4 flex gap-2 py-1 justify-start items-center rounded-md hover:bg-gray-200 transition-colors duration-300">
                <button
                    onclick={() => {toggleTaskCreation()}}
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