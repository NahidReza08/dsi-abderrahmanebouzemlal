// @ts-ignore
export function timerAction(element, {start, pause, reset, isRunningStore, minutesStore, secondsStore}) {
    const handleStartPomodoro = () => start();
    const handlePause = () => pause();
    const handlenext = () => reset();
    const handleReset = () => reset();
    isRunningStore.subscribe(value => isRunning = value);
    minutesStore.subscribe(value => timerMinutes = value);
    secondsStore.subscribe(value => timerSeconds = value);
    
    let isRunning = false;
    let timerMinutes = 0;
    let timerSeconds = 0;

    element.addEventListener('start', handleStartPomodoro);
    element.addEventListener('pause', handlePause);
    element.addEventListener('next', handlenext);
    element.addEventListener('reset', handleReset);
    
    $effect(() => {
        if (!isRunning) return;
        
        const interval = setInterval(() => {
            if (timerSeconds === 0) {
                if (timerMinutes === 0) {
                    clearInterval(interval);
                    isRunning = false;
                    element.dispatchEvent(new CustomEvent('next')); 
                } else {
                    timerMinutes -= 1;
                    timerSeconds = 59;
                }
            } else {
                timerSeconds -= 1;
            }
        }, 1000);
        
        return () => clearInterval(interval);
    });
}