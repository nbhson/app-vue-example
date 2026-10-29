<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <main class="not-found">
    <p class="code" aria-hidden="true">404</p>
    <h1>Page not found</h1>
    <p class="hint">The page you are looking for does not exist or has been moved.</p>
    <RouterLink to="/" class="home-link">Back to My Tasks</RouterLink>
  </main>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: var(--space-8) var(--space-4);
}

.code {
  font-size: 5rem;
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

h1 {
  font-size: var(--fs-xl);
  margin: var(--space-4) 0 var(--space-2);
}

.hint {
  color: var(--color-muted);
  margin-bottom: var(--space-6);
}

.home-link {
  display: inline-block;
  padding: var(--space-2) var(--space-5);
  border-radius: var(--radius-pill);
  background: var(--color-primary);
  color: var(--color-on-primary);
  font-weight: 600;
}

.home-link:hover {
  background: var(--color-primary-strong);
  opacity: 1;
}
</style>
