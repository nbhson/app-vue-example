<script setup lang="ts">
import { computed } from 'vue';
import { useTodoStore } from '../stores/todo';

const todoStore = useTodoStore();
const pendingCount = computed(() => todoStore.totalCount - todoStore.doneCount);

const stats = computed(() => [
  { label: 'Total Tasks', value: todoStore.totalCount },
  { label: 'Completed', value: todoStore.doneCount },
  { label: 'Pending', value: pendingCount.value }
]);
</script>

<template>
  <main class="about-view">
    <header class="header">
      <h1>Statistics</h1>
      <p>Tracking your progress and productivity</p>
    </header>

    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.label" class="stat-card">
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>

    <div class="info">
      <p>Built with Vue 3, Vite, Pinia, and Vue Router.</p>
      <p>This is a standard project structure example.</p>
    </div>

    <nav class="back-link" aria-label="Secondary">
      <RouterLink to="/">Back to Home</RouterLink>
    </nav>
  </main>
</template>

<style scoped>
.about-view {
  padding: 2rem 0;
  text-align: center;
}

h1 {
  margin-bottom: 1rem;
  color: var(--color-text);
  font-size: 2.25rem;
  font-weight: 700;
}

.header p {
  color: var(--color-muted);
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1.25rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
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
  color: var(--color-muted);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.info {
  color: var(--color-text);
  line-height: 1.8;
  margin-bottom: 2rem;
}
</style>
