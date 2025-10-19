// @ts-nocheck
import { getTimerStore, getSessionStore } from '../lib/stores.svelte.js';


export function timerActions(node, options = {}) {
    const timerStore = getTimerStore();
    const sessionStore = getSessionStore();
    
    let timerId = null;
    
    const {
        onComplete = () => {},
        onTick = () => {},
        autoStart = false
    } = options;
    
    function start() {
        if (timerStore.value.isRunning || timerId) return;
        
        timerStore.setRunning(true);
        
        timerId = setInterval(() => {
            const result = timerStore.tick();
            
            onTick(timerStore.value);
            
            if (result === 'completed') {
                stop();
                onComplete(timerStore.value);
                
                if (timerStore.value.currentMode === 'Pomodoro') {
                    sessionStore.completePomodoro();
                }
            }
        }, 1000);
    }
    
    function stop() {
        timerStore.setRunning(false);
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
    }
    
    function reset() {
        stop();
        const modeSettings = {
            'pomodoro': 25,
            'shortBreak': 5,
            'longBreak': 15
        };

        const minutes = modeSettings[timerStore.value.currentMode] || 25;
        timerStore.setTime(minutes, 0);
    }
    
    function setMode(mode) {
        stop();
        timerStore.setMode(mode);
        reset();
    }
    
    function setCustomTime(minutes, seconds = 0) {
        stop();
        timerStore.setTime(minutes, seconds);
    }
    
    if (autoStart) {
        start();
    }
    const actionInstance = {
        start,
        stop,
        reset,
        setMode,
        setCustomTime
    };

    Object.assign(node, actionInstance);

    return {


        update(newOptions) {
            Object.assign(options, newOptions);
        },
        destroy() {
            stop();
        }
    };
}

export function modeSwitcherAction(node, modes) {
    const timerStore = getTimerStore();
    
    function switchToMode(mode) {
        if (timerStore.value.isRunning) {
            if (!confirm('Timer is running. Switch mode anyway?')) {
                return;
            }
        }
        
        const timerActions = node.closest('[data-timer-actions]')?._timerActions;
        if (timerActions) {
            timerActions.setMode(mode);
        }
    }
    
    const buttons = node.querySelectorAll('[data-mode]');
    buttons.forEach(button => {
        const mode = button.dataset.mode;
        button.addEventListener('click', () => switchToMode(mode));
    });
    
    return {
        destroy() {
            buttons.forEach(button => {
                button.removeEventListener('click', () => switchToMode(mode));
            });
        }
    };
}