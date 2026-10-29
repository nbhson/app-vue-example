<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTodoStore } from '../stores/todo';
import TodoInput from '../components/TodoInput.vue';
import TodoList from '../components/TodoList.vue';

const todoStore = useTodoStore();
const filter = ref<'all' | 'active' | 'completed'>('all');

onMounted(() => {
  if (todoStore.totalCount === 0) void todoStore.fetchTodos();
});

const filteredTodos = computed(() => {
  if (filter.value === 'active') return todoStore.incompleteTodos;
  if (filter.value === 'completed') return todoStore.finishedTodos;
  return todoStore.todos.slice().reverse();
});

const filters: Array<{ value: 'all' | 'active' | 'completed'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' }
];
</script>

<template>
  <main class="home-view">
    <header class="header">
      <h1>My Tasks</h1>
      <div class="stats" aria-live="polite">
        <span>{{ todoStore.doneCount }} / {{ todoStore.totalCount }} done</span>
      </div>
    </header>

    <TodoInput />

    <div class="filters" role="group" aria-label="Filter tasks">
      <button
        v-for="f in filters"
        :key="f.value"
        :class="{ active: filter === f.value }"
        :aria-pressed="filter === f.value"
        @click="filter = f.value"
      >
        {{ f.label }}
      </button>
    </div>

    <div v-if="todoStore.loading" class="state-block">
      <div class="spinner" aria-hidden="true"></div>
      Loading tasks...
    </div>

    <div v-else-if="todoStore.error" class="state-block state-block--error" role="alert">
      {{ todoStore.error }}
      <button class="retry-btn" @click="todoStore.fetchTodos()">Retry</button>
    </div>

    <TodoList v-else :todos="filteredTodos" />

    <nav class="footer-link" aria-label="Secondary">
      <RouterLink to="/about">About</RouterLink>
      <span aria-hidden="true">·</span>
      <RouterLink to="/users">Manage Users</RouterLink>
    </nav>
  </main>
</template>

<style scoped>
.home-view {
  padding-bottom: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

[data-theme='dark'] h1 {
  -webkit-text-fill-color: var(--color-primary);
  background: none;
}

.stats {
  font-size: 0.9rem;
  color: var(--color-muted);
  font-weight: 600;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 0.3rem 0.8rem;
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-sm);
  white-space: nowrap;
}

.filters {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.filters button {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-pill);
  font-weight: 500;
  color: var(--color-muted);
  background: transparent;
}

.filters button:hover {
  background: var(--color-surface-alt);
  color: var(--color-text);
}

.filters button.active {
  background: var(--color-primary);
  color: var(--color-on-primary);
  box-shadow: var(--shadow-sm);
}

.retry-btn {
  margin-top: 0.5rem;
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius-pill);
  background: var(--color-primary);
  color: var(--color-on-primary);
  font-weight: 600;
}

.footer-link {
  margin-top: 3rem;
  text-align: center;
  font-size: 0.9rem;
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}
</style>
