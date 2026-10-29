<script setup lang="ts">
import { ref } from 'vue';
import { useTodoStore } from '../stores/todo';

const todoStore = useTodoStore();
const newTodo = ref('');

const MAX_LENGTH = 200;

function handleSubmit() {
  const text = newTodo.value.trim().slice(0, MAX_LENGTH);
  if (text) {
    void todoStore.addTodo(text);
    newTodo.value = '';
  }
}
</script>

<template>
  <form class="input-wrapper" @submit.prevent="handleSubmit">
    <label class="visually-hidden" for="new-todo-input">New task</label>
    <input
      id="new-todo-input"
      v-model="newTodo"
      type="text"
      placeholder="Add a new task..."
      :maxlength="MAX_LENGTH"
      :disabled="todoStore.loading"
    />
    <button type="submit" class="add-btn" :disabled="todoStore.loading" aria-label="Add task">
      <span class="icon" aria-hidden="true">+</span>
    </button>
  </form>
</template>

<style scoped>
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 0.5rem;
  margin-bottom: 2rem;
  transition:
    box-shadow 0.3s ease,
    background-color 0.2s ease;
}

.input-wrapper:focus-within {
  box-shadow: var(--shadow-md);
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0.8rem 1rem;
  font-size: 1.1rem;
  color: var(--color-text);
  outline: none;
  min-width: 0;
}

input:disabled,
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

input::placeholder {
  color: var(--color-muted);
}

.add-btn {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 0.2rem;
}

.add-btn:hover:not(:disabled) {
  background-color: var(--color-primary-strong);
  transform: translateY(-1px);
}

.add-btn:active {
  transform: translateY(0);
}
</style>
