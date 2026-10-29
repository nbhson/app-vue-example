<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTodoStore } from '../stores/todo';
import TodoInput from '../components/TodoInput.vue';
import TodoList from '../components/TodoList.vue';

const todoStore = useTodoStore();
const filter = ref<'all' | 'active' | 'completed'>('all');
const search = ref('');

onMounted(() => {
  if (todoStore.totalCount === 0) void todoStore.fetchTodos();
});

const filters: Array<{ value: 'all' | 'active' | 'completed'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' }
];

const filteredTodos = computed(() => {
  let list: typeof todoStore.todos;
  if (filter.value === 'active') list = todoStore.incompleteTodos;
  else if (filter.value === 'completed') list = todoStore.finishedTodos;
  else list = todoStore.todos.slice().reverse(); // newest first

  const query = search.value.trim().toLowerCase();
  if (query) {
    list = list.filter(t => t.text.toLowerCase().includes(query));
  }
  return list;
});

const isSearching = computed(() => search.value.trim().length > 0);
const emptyMessage = computed(() =>
  isSearching.value
    ? 'No tasks match your search.'
    : filter.value === 'completed'
      ? 'No completed tasks yet.'
      : filter.value === 'active'
        ? 'All tasks are done — nice work!'
        : 'No tasks yet. Add your first one above.'
);

function clearCompleted() {
  void todoStore.clearCompleted();
}
</script>

<template>
  <section class="home-view" aria-labelledby="tasks-heading">
    <header class="header">
      <h1 id="tasks-heading">My Tasks</h1>
      <div class="stats" aria-live="polite">
        <span>{{ todoStore.doneCount }} / {{ todoStore.totalCount }} done</span>
      </div>
    </header>

    <TodoInput />

    <div class="toolbar">
      <div class="filters" role="group" aria-label="Filter tasks">
        <button
          v-for="f in filters"
          :key="f.value"
          type="button"
          :class="{ active: filter === f.value }"
          :aria-pressed="filter === f.value"
          @click="filter = f.value"
        >
          {{ f.label }}
        </button>
      </div>

      <div class="search-wrapper">
        <label class="visually-hidden" for="todo-search">Search tasks</label>
        <input
          id="todo-search"
          v-model="search"
          type="search"
          placeholder="Search tasks..."
          autocomplete="off"
        />
        <button
          v-if="isSearching"
          type="button"
          class="clear-search"
          aria-label="Clear search"
          @click="search = ''"
        >
          &times;
        </button>
      </div>

      <button
        v-if="todoStore.doneCount > 0"
        type="button"
        class="clear-completed"
        :disabled="todoStore.busy"
        @click="clearCompleted"
      >
        Clear completed ({{ todoStore.doneCount }})
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

    <TodoList v-else :todos="filteredTodos" :empty-message="emptyMessage" />
  </section>
</template>

<style scoped>
.home-view {
  padding-bottom: var(--space-6);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
}

h1 {
  font-size: var(--fs-2xl);
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
  font-size: var(--fs-sm);
  color: var(--color-muted);
  font-weight: 600;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-sm);
  white-space: nowrap;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-border);
  flex-wrap: wrap;
}

.filters {
  display: flex;
  gap: var(--space-2);
}

.filters button {
  padding: var(--space-2) var(--space-4);
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

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 140px;
}

.search-wrapper input {
  width: 100%;
  padding: var(--space-2) var(--space-4);
  padding-right: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--fs-sm);
}

.search-wrapper input::placeholder {
  color: var(--color-muted);
}

.clear-search {
  position: absolute;
  right: var(--space-2);
  color: var(--color-muted);
  font-size: 1rem;
  line-height: 1;
  padding: var(--space-1);
  border-radius: var(--radius-pill);
}

.clear-search:hover {
  color: var(--color-text);
}

.clear-completed {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  color: var(--color-danger);
  font-size: var(--fs-sm);
  font-weight: 600;
  background: var(--color-surface);
  white-space: nowrap;
}

.clear-completed:hover:not(:disabled) {
  border-color: var(--color-danger);
  background: var(--color-danger-soft);
}

.clear-completed:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.retry-btn {
  margin-top: var(--space-2);
  padding: var(--space-2) var(--space-5);
  border-radius: var(--radius-pill);
  background: var(--color-primary);
  color: var(--color-on-primary);
  font-weight: 600;
}

@media (max-width: 560px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .clear-completed {
    align-self: flex-start;
  }
}
</style>
