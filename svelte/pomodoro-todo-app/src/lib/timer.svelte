<script>
// @ts-nocheck
    let {timerMinutes = $bindable(25), timerSeconds = $bindable(0), isRunning=$bindable(false), goNextMode} = $props();
    function formatNumber(num) {
        return num < 10 ? String(num).padStart(2, "0") : String(num);
    }
    $effect(() => {
        if (!isRunning) return;
        
        const interval = setInterval(() => {
            if (timerSeconds === 0) {
                if (timerMinutes === 0) {
                    clearInterval(interval);
                    isRunning = false;
                    goNextMode();
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
</script>
<div class="text-7xl font-extrabold">{formatNumber(timerMinutes)}:{formatNumber(timerSeconds)}</div>