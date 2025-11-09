import { todoApi } from '../utils/api.js';

//@ts-ignore
export let todos = $state({value: []});
export let loading = $state({value: false});
export let error = $state({value: ''});
export let filter = $state({value: 'all'});
export let editingId = $state({value: null});
export let editText = $state({value: ""});

// Derived values - export functions that return the derived values
export function getFilteredTodos() {
  if (filter.value === 'active') return todos.value.filter(t => !t.completed);
  if (filter.value === 'completed') return todos.value.filter(t => t.completed);
  return todos.value;
}

export function getActiveCount() {
  return todos.value.filter(t => !t.completed).length;
}

export function getCompletedCount() {
  return todos.value.filter(t => t.completed).length;
}

export function getProgress() {
  return todos.value.length > 0 
    ? (todos.value.filter(t => t.completed).length / todos.value.length) * 100 
    : 0;
}

// Actions
export const todoActions = {
  async fetchTodos() {
    loading.value = true;
    error.value = '';
    try {
      const response = await todoApi.getAll();
      // @ts-ignore
      todos.value = response;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  },

  async addTodo(text) {
    if (!text.trim()) return;
    try {
      error.value = '';
      const newTodo = await todoApi.create({ text: text.trim() });
      todos.value = [newTodo, ...todos.value];
      return newTodo;
    } catch (err) {
      error.value = err.message;
    }
  },
  async reorderTodos(fromIndex, toIndex) {
    try {
      error.value = '';
      
      const currentTodos = todos.value;
      const todoId = currentTodos[fromIndex]._id;
      
      const updatedTodo = await todoApi.reorder(todoId, toIndex);
      
      const [movedItem] = currentTodos.splice(fromIndex, 1);
      currentTodos.splice(toIndex, 0, movedItem);
      todos.value = currentTodos;
      
      return updatedTodo;
    } catch (err) {
      error.value = err.message;
    }
  },
  async toggleTodo(id) {
    try {
      error.value = '';
      const todo = todos.value.find(t => t._id === id);
      if (!todo) return;
      const updatedTodo = await todoApi.update(id, { completed: !todo.completed });
      todos.value = todos.value.map(t => t._id === id ? updatedTodo : t);
      todos.value = todos.value.sort((a, b) => a.completed - b.completed);
      
    } catch (err) {
      error.value = err.message;
    }
  },

  async updateTodo(id, updates) {
    try {
      error.value = '';
      const updatedTodo = await todoApi.update(id, updates);
      todos.value = todos.value.map(t => t._id === id ? updatedTodo : t);
      return updatedTodo;
    } catch (err) {
      error.value = err.message;
    }
  },

  async deleteTodo(id) {
    try {
      error.value = '';
      await todoApi.delete(id);
      todos.value = todos.value.filter(t => t._id !== id);
    } catch (err) {
      error.value = err.message;
    }
  },

  async clearCompleted() {
    try {
      error.value = '';
      const completedTodos = todos.value.filter(t => t.completed);
      for (const todo of completedTodos) {
        await todoApi.delete(todo._id);
      }
      todos.value = todos.value.filter(t => !t.completed);
    } catch (err) {
      error.value = err.message;
    }
  },

  setFilter(newFilter) {
    filter.value = newFilter;
  },

  setEditing(id, text = '') {
    editingId.value = id;
    editText.value = text;
  },

  cancelEdit() {
    editingId.value = null;
    editText.value = '';
  }
};