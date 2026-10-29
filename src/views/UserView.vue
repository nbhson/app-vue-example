<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();

onMounted(() => {
  if (userStore.userCount === 0) void userStore.fetchUsers();
});
</script>

<template>
  <main class="user-view">
    <header class="header">
      <h1>Users</h1>
      <div class="info-tag">User Management</div>
    </header>

    <div v-if="userStore.loading" class="state-block">
      <div class="spinner" aria-hidden="true"></div>
      Loading users...
    </div>

    <div v-else-if="userStore.error" class="state-block state-block--error" role="alert">
      {{ userStore.error }}
      <button class="retry-btn" @click="userStore.fetchUsers()">Retry</button>
    </div>

    <div v-else class="user-grid">
      <RouterLink
        v-for="user in userStore.users"
        :key="user.id"
        :to="`/users/${user.id}`"
        class="user-card"
      >
        <div class="user-avatar" aria-hidden="true">{{ user.name?.charAt(0) }}</div>
        <div class="user-info">
          <h2>{{ user.name }}</h2>
          <p class="email">{{ user.email }}</p>
          <p class="company">{{ user.company?.name }}</p>
        </div>
      </RouterLink>
    </div>

    <nav class="back-link" aria-label="Secondary">
      <RouterLink to="/">Back to Todos</RouterLink>
    </nav>
  </main>
</template>

<style scoped>
.user-view {
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
  color: var(--color-text);
}

.info-tag {
  background: var(--color-accent);
  color: var(--color-on-primary);
  padding: 0.3rem 0.8rem;
  border-radius: var(--radius-pill);
  font-size: 0.8rem;
  font-weight: 600;
}

.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.user-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  gap: 1rem;
  color: inherit;
  transition:
    transform 0.2s,
    box-shadow 0.2s,
    background-color 0.2s ease;
}

.user-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  opacity: 1;
}

.user-avatar {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: var(--color-on-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
}

.user-info h2 {
  font-size: 1.1rem;
  margin-bottom: 0.2rem;
  color: var(--color-text);
}

.email {
  color: var(--color-muted);
  font-size: 0.9rem;
  overflow-wrap: anywhere;
}

.company {
  font-size: 0.8rem;
  color: var(--color-primary);
  font-weight: 500;
  margin-top: 0.2rem;
}

.back-link {
  text-align: center;
  margin-top: 2rem;
}

.retry-btn {
  margin-top: 0.5rem;
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius-pill);
  background: var(--color-primary);
  color: var(--color-on-primary);
  font-weight: 600;
}
</style>
