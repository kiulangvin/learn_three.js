import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },
    {
      path: '/',
      name: 'scene',
      component: () => import('../views/Test1.vue')
    },
    {
      path: '/Test2',
      name: 'Test2',
      component: () => import('../views/Test2.vue')
    },
    {
      path: '/Test3',
      name: 'Test3',
      component: () => import('../views/Test3.vue')
    },
    {
      path: '/Test4',
      name: 'Test4',
      component: () => import('../views/Test4.vue')
    },
    {
      path: '/Test5',
      name: 'Test5',
      component: () => import('../views/Test5.vue')
    },
    {
      path: '/Test6',
      name: 'Test6',
      component: () => import('../views/Test6.vue')
    },
    {
      path: '/Test7',
      name: 'Test7',
      component: () => import('../views/Test7.vue')
    }
  ]
})

export default router
