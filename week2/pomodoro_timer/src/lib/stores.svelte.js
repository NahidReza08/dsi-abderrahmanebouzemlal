import { setContext, getContext } from 'svelte';

const SESSION_STATE_KEY = Symbol('session-state');
const TIMER_STATE_KEY = Symbol('timer-state');

function createSessionStore(initialValue = { 
    actualPomodoros: 0,
    estimatedPomodoros: 1,
    title: '',
    isCompleted: false,
    id: null
}) {
    let state = $state({ ...initialValue });
    
    return {
        get value() { return state; },
        
        setTask(task) {
            state = {...task};
        },
        updateTask(updates) {
            state = { ...state, ...updates };
        },

        clearTask() {
            state.title = '';
            state.estimatedPomodoros = 1;
            state.actualPomodoros = 0;
            state.isCompleted = false;
            state.id = null;
        },
        
        completePomodoro() {
            state.actualPomodoros += 1;
        },
        
        toggleTask() {
            state.isCompleted = !state.isCompleted;
        },
        
        reset() {
            state.actualPomodoros = 0;
            state.estimatedPomodoros = 1;
            state.title = '';
            state.isCompleted = false;
            state.id = null;
        }
    };
}

function createTimerStore(initialValue = { 
    currentMode: 'Pomodoro', 
    minutes: 25, 
    seconds: 0, 
    isRunning: false 
}) {
    const state = $state({ ...initialValue });
    
    return {
        get value() { return state; },
        
        setRunning(isRunning) {
            state.isRunning = isRunning;
        },
        
        setTime(minutes, seconds = 0) {
            state.minutes = minutes;
            state.seconds = seconds;
        },
        
        setMode(mode) {
            state.currentMode = mode;
            state.isRunning = false;
            state.seconds = 0;
            const modeSettings = {
                'pomodoro': 25,
                'shortBreak': 5,
                'longBreak': 15
            };
            state.minutes = modeSettings[mode] || 25;
        },
        
        tick() {
            if (state.seconds > 0) {
                state.seconds -= 1;
            } else if (state.minutes > 0) {
                state.minutes -= 1;
                state.seconds = 59;
            } else {
                state.isRunning = false;
                return 'completed';
            }
            return 'ticking';
        }
    };
}

export function initStores() {
    const sessionStore = createSessionStore();
    const timerStore = createTimerStore();
    
    setContext(SESSION_STATE_KEY, sessionStore);
    setContext(TIMER_STATE_KEY, timerStore);
    
    return { sessionStore, timerStore };
}

export function getSessionStore() {
    const store = getContext(SESSION_STATE_KEY);
    if (!store) {
        throw new Error('Session store not found. Did you call initStores() in your root component?');
    }
    return store;
}

export function getTimerStore() {
    const store = getContext(TIMER_STATE_KEY);
    if (!store) {
        throw new Error('Timer store not found. Did you call initStores() in your root component?');
    }
    return store;
}

export function getStores() {
    return {
        sessionStore: getSessionStore(),
        timerStore: getTimerStore()
    };
}
