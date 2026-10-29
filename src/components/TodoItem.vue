<script setup lang="ts">
import { computed } from 'vue';
import { useTodoStore } from '../stores/todo';
import type { Todo } from '../types';

const props = defineProps<{ todo: Todo }>();

const todoStore = useTodoStore();
const toggleLabel = computed(
  () => `Mark "${props.todo.text}" as ${props.todo.completed ? 'active' : 'completed'}`
);

function toggle() {
  void todoStore.toggleTodo(props.todo.id);
}

function remove() {
  void todoStore.removeTodo(props.todo.id);
}
</script>

<template>
  <div class="todo-item" :class="{ completed: todo.completed }">
    <label class="checkbox-container">
      <input
        type="checkbox"
        :checked="todo.completed"
        :aria-label="toggleLabel"
        @change="toggle"
      />
      <span class="checkmark" aria-hidden="true"></span>
    </label>

    <span class="todo-text">{{ todo.text }}</span>

    <button class="delete-btn" aria-label="Delete task" @click="remove">
      &times;
    </button>
  </div>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  background: var(--color-surface);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  margin-bottom: 0.8rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.todo-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.todo-item.completed {
  opacity: 0.7;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: var(--color-muted);
}

.checkbox-container {
  display: block;
  position: relative;
  padding-left: 30px;
  cursor: pointer;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: -5px;
  left: 0;
  height: 22px;
  width: 22px;
  background-color: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  transition: background-color 0.2s;
}

.checkbox-container:hover input ~ .checkmark {
  border-color: var(--color-primary);
}

.checkbox-container input:focus-visible ~ .checkmark {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: var(--color-accent);
  border-color: var(--color-accent);
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 8px;
  top: 4px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

[data-theme='dark'] .checkbox-container input:checked ~ .checkmark:after {
  border-color: var(--color-on-primary);
}

.todo-text {
  flex: 1;
  margin-left: 0.5rem;
  font-size: 1rem;
  color: var(--color-text);
  transition: color 0.2s;
  overflow-wrap: anywhere;
}

.delete-btn {
  color: var(--color-muted);
  font-size: 1.5rem;
  line-height: 1;
  padding: 0 0.5rem;
  border-radius: var(--radius-sm);
}

.delete-btn:hover {
  color: var(--color-danger);
  background-color: var(--color-danger-soft);
}
</style>
