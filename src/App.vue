<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { useTheme } from './composables/useTheme';

const { theme, toggle } = useTheme();

const navItems = [
  { to: '/', label: 'Tasks' },
  { to: '/users', label: 'Users' },
  { to: '/about', label: 'Statistics' }
];
</script>

<template>
  <a class="skip-link" href="#main-content">Skip to content</a>

  <header class="app-header">
    <RouterLink to="/" class="brand" aria-label="vue-project home">
      <span class="brand-mark" aria-hidden="true">✓</span>
      <span class="brand-name">vue-project</span>
    </RouterLink>

    <nav class="app-nav" aria-label="Primary">
      <RouterLink v-for="item in navItems" :key="item.to" :to="item.to" class="nav-link">
        {{ item.label }}
      </RouterLink>
    </nav>

    <button
      type="button"
      class="theme-toggle"
      :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
      :title="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
      @click="toggle"
    >
      <span aria-hidden="true">{{ theme === 'dark' ? '☀️' : '🌙' }}</span>
    </button>
  </header>

  <main id="main-content">
    <RouterView />
  </main>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) 0;
  margin-bottom: var(--space-5);
  border-bottom: 1px solid var(--color-border);
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: 700;
  color: var(--color-text);
  margin-right: auto;
}

.brand:hover {
  opacity: 1;
}

.brand-mark {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: var(--color-on-primary);
  font-size: 0.9rem;
  font-weight: 800;
}

.app-nav {
  display: flex;
  gap: var(--space-1);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  padding: var(--space-1);
}

.nav-link {
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-pill);
  color: var(--color-muted);
  font-weight: 500;
  font-size: var(--fs-sm);
  white-space: nowrap;
}

.nav-link:hover {
  color: var(--color-text);
  opacity: 1;
}

/* RouterLink active classes — exact for "/", prefix for children (/users/:id). */
.nav-link.router-link-active,
.nav-link.router-link-exact-active {
  background: var(--color-primary);
  color: var(--color-on-primary);
}

.theme-toggle {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  font-size: 1.05rem;
}

.theme-toggle:hover {
  border-color: var(--color-primary);
}

@media (max-width: 560px) {
  .brand-name {
    display: none;
  }

  .app-header {
    flex-wrap: wrap;
  }
}
</style>
