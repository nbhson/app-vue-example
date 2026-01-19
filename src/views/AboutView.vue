<script setup lang="ts">
import { useTodoStore } from '../stores/todo'

const todoStore = useTodoStore()
</script>

<template>
  <div class="about-view">
    <header class="header">
      <h1>Statistics</h1>
      <p>Tracking your progress and productivity</p>
    </header>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{{ todoStore.totalCount }}</div>
        <div class="stat-label">Total Tasks</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ todoStore.doneCount }}</div>
        <div class="stat-label">Completed</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ todoStore.totalCount - todoStore.doneCount }}</div>
        <div class="stat-label">Pending</div>
      </div>
    </div>

    <div class="info">
      <p>Built with Vue 3, Vite, Vuex 4, and Vue Router.</p>
      <p>This is a standard project structure example.</p>
    </div>

    <div class="back-link">
      <RouterLink to="/">Back to Home</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.about-view {
  padding: 2rem 0;
  text-align: center;
}

h1 {
  margin-bottom: 2rem;
  color: var(--color-text);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--color-gray);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.info {
  color: var(--color-text);
  line-height: 1.8;
  margin-bottom: 2rem;
}

.back-link a {
  display: inline-block;
  padding: 0.8rem 2rem;
  background: white;
  border-radius: 30px;
  box-shadow: var(--shadow-sm);
  font-weight: 600;
}

.back-link a:hover {
  box-shadow: var(--shadow-md);
  color: var(--color-secondary);
}
</style>
