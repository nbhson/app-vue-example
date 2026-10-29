<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useUserStore } from '../stores/user';

const props = defineProps<{ id: string }>();

const userStore = useUserStore();

onMounted(() => {
  if (userStore.userCount === 0) void userStore.fetchUsers();
});

const user = computed(() => userStore.users.find(u => u.id === Number(props.id)));

const detailRows = computed(() => {
  const u = user.value;
  if (!u) return [];
  return [
    { label: 'Email', value: u.email, href: u.email ? `mailto:${u.email}` : undefined },
    { label: 'Phone', value: u.phone, href: u.phone ? `tel:${u.phone.replace(/\s/g, '')}` : undefined },
    { label: 'Website', value: u.website, href: u.website ? `https://${u.website.replace(/^https?:\/\//, '')}` : undefined },
    {
      label: 'Address',
      value: [u.address.suite, u.address.street, u.address.city, u.address.zipcode]
        .filter(Boolean)
        .join(', ')
    }
  ];
});
</script>

<template>
  <main class="user-detail">
    <template v-if="userStore.loading">
      <div class="state-block">
        <div class="spinner" aria-hidden="true"></div>
        Loading user...
      </div>
    </template>

    <template v-else-if="userStore.error">
      <div class="state-block state-block--error" role="alert">
        {{ userStore.error }}
        <button class="retry-btn" @click="userStore.fetchUsers()">Retry</button>
      </div>
    </template>

    <template v-else-if="user">
      <header class="header">
        <div class="identity">
          <div class="avatar" aria-hidden="true">{{ user.name.charAt(0) }}</div>
          <div>
            <h1>{{ user.name }}</h1>
            <p class="username">@{{ user.username }} · {{ user.company.name }}</p>
          </div>
        </div>
        <span class="badge">User #{{ user.id }}</span>
      </header>

      <div class="company-card">
        <h2>{{ user.company.name }}</h2>
        <p class="catchphrase">“{{ user.company.catchPhrase }}”</p>
        <p class="bs">{{ user.company.bs }}</p>
      </div>

      <dl class="details">
        <div v-for="row in detailRows" :key="row.label" class="row">
          <dt>{{ row.label }}</dt>
          <dd>
            <a v-if="row.value && row.href" :href="row.href">{{ row.value }}</a>
            <span v-else>{{ row.value || '—' }}</span>
          </dd>
        </div>
      </dl>

      <nav class="actions" aria-label="Secondary">
        <RouterLink to="/users" class="ghost-btn">← All users</RouterLink>
      </nav>
    </template>

    <div v-else class="state-block state-block--error" role="alert">
      User not found.
      <RouterLink to="/users" class="retry-btn">Back to users</RouterLink>
    </div>
  </main>
</template>

<style scoped>
.user-detail {
  padding-bottom: var(--space-6);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
  flex-wrap: wrap;
}

.avatar {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: var(--color-on-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--fs-xl);
  font-weight: 700;
}

.username {
  color: var(--color-muted);
  font-size: var(--fs-sm);
}

.badge {
  background: var(--color-accent);
  color: var(--color-on-primary);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-pill);
  font-size: var(--fs-sm);
  font-weight: 600;
  white-space: nowrap;
}

.company-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--space-5);
}

.company-card h2 {
  font-size: var(--fs-lg);
  color: var(--color-primary);
}

.catchphrase {
  color: var(--color-muted);
  font-style: italic;
  margin-top: var(--space-1);
}

.bs {
  font-size: var(--fs-sm);
  color: var(--color-muted);
  margin-top: var(--space-2);
}

dl {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  margin: 0 0 var(--space-5);
  padding: var(--space-2) var(--space-5);
}

dl > div {
  display: grid;
  grid-template-columns: 7rem 1fr;
  gap: var(--space-4);
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-border);
}

dl > div:last-child {
  border-bottom: none;
}

dt {
  color: var(--color-muted);
  font-weight: 600;
  font-size: var(--fs-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  align-self: center;
}

dd {
  overflow-wrap: anywhere;
}

.ghost-btn {
  display: inline-block;
  padding: var(--space-2) var(--space-5);
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-weight: 600;
}

.ghost-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  opacity: 1;
}

@media (max-width: 480px) {
  dl > div {
    grid-template-columns: 1fr;
    gap: var(--space-1);
  }
}
</style>
