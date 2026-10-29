import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { setPageTitle } from '../composables/useDocumentTitle';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'My Tasks' }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: { title: 'Statistics' }
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('../views/UserView.vue'),
    meta: { title: 'Users' }
  },
  {
    path: '/users/:id(\\d+)',
    name: 'user-detail',
    component: () => import('../views/UserDetailView.vue'),
    props: true,
    meta: { title: 'User Detail' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: 'Page Not Found' }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.afterEach(to => {
  setPageTitle(to.meta.title as string | undefined);
});

export default router;
