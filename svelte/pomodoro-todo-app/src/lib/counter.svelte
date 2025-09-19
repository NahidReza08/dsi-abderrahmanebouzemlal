<script>
// @ts-nocheck
    import Timer from "./timer.svelte";
    import { derived } from "svelte/store";
    import { faForward } from "@fortawesome/free-solid-svg-icons";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";

    let timerMinutes = $state(25);
    let timerSeconds = $state(0);
    let isRunning = $state(false);
    let currentMode = $state('pomodoro');

    const modes = $derived.by( () => {
        switch(currentMode) {
            case 'pomodoro': return { label: 'Pomodoro', minutes: 25 };
            case 'shortBreak': return { label: 'Short Break', minutes: 5 };
            case 'longBreak': return { label: 'Long Break', minutes: 15 };
            default: return { label: 'Pomodoro', minutes: 25 };
    }
    });
    function setMode(mode) {
        currentMode = mode;
        timerMinutes = modes.minutes;
        timerSeconds = 0;
        isRunning = false;
    }

</script>
<div class="bg-light-desktop bg-cover p-28 flex justify-center font-medium">
    <div class="flex flex-col justify-center items-center w-fit text-white gap-8">
        <div class="flex justify-between gap-5">
            <button onclick={() => {setMode("pomodoro")}} class="hover:cursor-pointer focus:bg-purple-600 focus:font-bold py-1 px-2 rounded-lg">Pomodoro</button>
            <button onclick={() => {setMode("shortBreak")}} class="hover:cursor-pointer focus:bg-purple-600 focus:font-bold py-1 px-2 rounded-lg">Short Break</button>
            <button onclick={() => {setMode("longBreak")}} class="hover:cursor-pointer focus:bg-purple-600 focus:font-bold py-1 px-2 rounded-lg">Long Break</button>
        </div>
        <Timer bind:timerMinutes bind:timerSeconds bind:isRunning/>
        <div class="flex justify-center items-center gap-4">
            <button
                onclick={() => {
                    isRunning = !isRunning;
                    let audio = new Audio("/home/abdou/side_projects/dsi-abderrahmanebouzemlal/svelte/pomodoro-todo-app/src/assets/mouse-click-290204.mp3");
                    audio.play();
                }} 
                class="bg-white text-purple-light font-bold text-2xl py-2 px-6 hover:cursor-pointer">
                {isRunning ? "PAUSE" : "START" }
            </button>
            {#if (isRunning)}
                <button 
                    class="bg-white text-purple-light font-bold text-2xl py-2 px-6 ml-4 hover:cursor-pointer" 
                    onclick={() => {isRunning = false; timerMinutes = modes.minutes; timerSeconds = 0;}}>
                    <FontAwesomeIcon icon={faForward}/>
                </button>
            {/if}
        </div>
    </div>
</div>