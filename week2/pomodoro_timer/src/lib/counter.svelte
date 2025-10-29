<script>
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import { faForward } from "@fortawesome/free-solid-svg-icons";
    import { getTimerStore,getSessionStore } from "./stores.svelte";
    import { timerActions  } from "../actions/actions.svelte";

    let timerActionsInstance;

    const timerStore = getTimerStore();
    const sessionStore = getSessionStore();

    const timerState = $derived(timerStore.value);
    const sessionState = $derived(sessionStore.value); 

    function hundleTimerComplete() {
        if (timerState.currentMode === 'pomodoro') {
            sessionStore.completePomodoro();
            if (sessionState.actualPomodoros % 4 === 0) {
                timerStore.setMode('longBreak');
            } else {
            timerStore.setMode('shortBreak');
            }
        } else {
            timerStore.setMode('pomodoro')
        }
        timerActionsInstance?.reset();
    }
    
    function handleTimerTick(timerState) {
        console.log('Tick:', timerState);
    }
</script>

<div class="bg-light-desktop bg-cover p-28 flex justify-center font-medium" data-timer-actions>
    <div class="flex flex-col justify-center items-center w-fit text-white gap-8 ">
        <div class="flex justify-between gap-5">
            <button 
                onclick={() => timerStore.setMode('pomodoro')} 
                class="hover:cursor-pointer hover:bg-purple-500 {timerState.currentMode === 'pomodoro' ? 'bg-purple-700 font-bold' : ''} py-2 px-4 rounded-lg transition-colors"
            >
            Pomodoro
        </button>
        <button 
            onclick={() => timerStore.setMode('shortBreak')} 
            class="hover:cursor-pointer hover:bg-purple-500 {timerState.currentMode === 'shortBreak' ? 'bg-purple-700 font-bold' : ''} py-2 px-4 rounded-lg transition-colors"
        >
            Short Break
        </button>
        <button 
            onclick={() => timerStore.setMode('longBreak')} 
            class="hover:cursor-pointer hover:bg-purple-500 {timerState.currentMode === 'longBreak' ? 'bg-purple-700 font-bold' : ''} py-2 px-4 rounded-lg transition-colors"
        >
            Long Break
        </button>
    </div>
    
    <div class="my-8" 
         use:timerActions={{
            onComplete: hundleTimerComplete,
            onTick: handleTimerTick
         }}
         bind:this={timerActionsInstance}>
         
        <span class="text-8xl font-extrabold text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            {timerState.minutes.toString().padStart(2, '0')}:
            {timerState.seconds.toString().padStart(2, '0')}
        </span>
    </div>
    <!-- timerActionsInstance will have .action property with start/stop/reset methods -->
    <div class="flex justify-center items-center gap-4">
      <button
        onclick={() => {
          if (timerState.isRunning) {
            timerActionsInstance?.stop();
          } else {
            timerActionsInstance?.start();
          }
        }}
        class="bg-white text-purple-600 font-bold text-2xl py-3 px-8 rounded-lg hover:cursor-pointer hover:bg-gray-100 transition-colors"
      >
        {timerState.isRunning ? "PAUSE" : "START"}
      </button>
      
      <button
        onclick={() => timerActionsInstance?.reset()}
        class="bg-white text-purple-600 font-bold text-xl py-3 px-6 rounded-lg hover:cursor-pointer hover:bg-gray-100 transition-colors"
      >
        Reset
      </button>
      
      {#if timerState.isRunning}
        <button
          onclick={hundleTimerComplete}
          class="bg-white text-purple-600 font-bold text-xl py-3 px-6 rounded-lg hover:cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <FontAwesomeIcon icon={faForward}/>
        </button>
      {/if}
    </div>
    
    <div class="text-center text-sm opacity-75">
        <h2>{timerState.currentMode}</h2>
        <p>Completed Pomodoros: {sessionState.actualPomodoros}</p>
    </div>
  </div>
</div>
