<script>
// @ts-nocheck
    import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    // iLmport { creaLteEventDispatcher } from 'svelte';
    // const dispatch = createEventDispatcher();

    let {task = $bindable()} = $props();

    const remainingTasks = $derived(task.actualPomodoros - task.estimatedPomodoros);
    const progressText = $derived(`${task.estimatedPomodoros} / ${task.actualPomodoros}`);
    function toggle() {
        task.isCompleted = !task.isCompleted;
    }
    function update() {
        
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
    class="bg-white border-b border-l-white border-l-4 border-gray-300 w-full p-3 flex justify-between items-center hover:cursor-pointer hover:border-l-4 hover:border-l-gray-300 focus-within:border-l-4 "
>
    <div class="flex gap-3 items-center mr-3">
        <input 
            onchange={toggle} 
            id={"task-" + task.taskNumber}
            type="checkbox"
            checked={task.isCompleted}
            class="peer cursor-pointer accent-pinkish"/>
        <label class="flex w-full peer-checked:line-through peer-checked:text-gray-400 cursor-pointer" for="task{task.taskNumber}">
            <p class="overflow-x-clip">
                {task.taskText}
            </p>
        </label>
    </div>
    <div class="flex gap-3 items-center">
        <p class="text-gray-400">{progressText}</p>

        <button
            class="hover:bg-gray-200 p-1 rounded"
        >
            <FontAwesomeIcon 
            class="text-gray-400 w-6 hover:cursor-pointer"
            icon={faPenToSquare}
        />
        </button>
    </div>
</div>