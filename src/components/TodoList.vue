<script setup lang="ts">
import TodoItem from './TodoItem.vue';
import type { Todo } from '../types';

withDefaults(defineProps<{ todos: Todo[]; emptyMessage?: string }>(), {
  emptyMessage: 'No tasks found.'
});
</script>

<template>
  <div class="todo-list">
    <TransitionGroup name="list" tag="ul" class="list">
      <li v-for="todo in todos" :key="todo.id" class="list-item">
        <TodoItem :todo="todo" />
      </li>
    </TransitionGroup>

    <div v-if="todos.length === 0" class="state-block empty-state" role="status">
      {{ emptyMessage }}
    </div>
  </div>
</template>

<style scoped>
.list {
  position: relative;
  list-style: none;
}

.list-item {
  list-style: none;
}

.empty-state {
  font-style: italic;
  padding: var(--space-6) var(--space-4);
}

/* List transitions */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
  width: 100%;
}
</style>
