<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTodoStore } from '../stores/todo'
import TodoInput from '../components/TodoInput.vue'
import TodoList from '../components/TodoList.vue'

const todoStore = useTodoStore()
const filter = ref('all') // all, active, completed

onMounted(() => {
  todoStore.fetchTodos()
})

const filteredTodos = computed(() => {
  if (filter.value === 'active') return todoStore.incompleteTodos
  if (filter.value === 'completed') return todoStore.finishedTodos
  return todoStore.todos.slice().reverse()
})

const setFilter = (f: string) => {
  filter.value = f
}
</script>

<template>
  <main class="home-view">
    <header class="header">
      <h1>My Tasks</h1>
      <div class="stats">
        <span>{{ todoStore.doneCount }} / {{ todoStore.totalCount }} done</span>
      </div>
    </header>

    <TodoInput />

    <div class="filters">
      <button 
        :class="{ active: filter === 'all' }" 
        @click="setFilter('all')"
      >
        All
      </button>
      <button 
        :class="{ active: filter === 'active' }" 
        @click="setFilter('active')"
      >
        Active
      </button>
      <button 
        :class="{ active: filter === 'completed' }" 
        @click="setFilter('completed')"
      >
        Completed
      </button>
    </div>

    <div v-if="todoStore.loading" class="loading-state">
      <div class="spinner"></div>
      Loading tasks...
    </div>

    <div v-else-if="todoStore.error" class="error-state">
      {{ todoStore.error }}
    </div>

    <TodoList v-else :todos="filteredTodos" />
    
    <div class="footer-link">
      <RouterLink to="/about">About</RouterLink> | 
      <RouterLink to="/users">Manage Users</RouterLink>
    </div>
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
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stats {
  font-size: 0.9rem;
  color: var(--color-gray);
  font-weight: 600;
  background: #fff;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  box-shadow: var(--shadow-sm);
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.filters button {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 500;
  color: var(--color-gray);
  background: transparent;
}

.filters button:hover {
  background: rgba(0,0,0,0.05);
  color: var(--color-text);
}

.filters button.active {
  background: var(--color-primary);
  color: white;
  box-shadow: var(--shadow-sm);
}

.footer-link {
  margin-top: 3rem;
  text-align: center;
  font-size: 0.9rem;
}

.loading-state, .error-state {
  text-align: center;
  padding: 3rem;
  color: var(--color-gray);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.error-state {
  color: var(--color-danger);
  background: rgba(231, 76, 60, 0.1);
  border-radius: var(--radius-md);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
