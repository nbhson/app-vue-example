<script setup lang="ts">
import TodoItem from './TodoItem.vue'
import type { Todo } from '../types'

defineProps<{
  todos: Todo[]
}>()
</script>

<template>
  <div class="todo-list">
    <TransitionGroup name="list">
      <TodoItem 
        v-for="todo in todos" 
        :key="todo.id" 
        :todo="todo" 
      />
    </TransitionGroup>
    
    <div v-if="todos.length === 0" class="empty-state">
      No tasks found.
    </div>
  </div>
</template>

<style scoped>
.todo-list {
  position: relative;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-gray);
  font-style: italic;
}

/* List Transitions */
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
