
import { createRouter, createWebHistory } from 'vue-router'
import LearningPage from '../pages/LearningPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/learning',
    },
    {
      path: '/learning',
      name: 'learning',
      component: LearningPage,
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
