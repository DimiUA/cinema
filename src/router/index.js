import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Sessions from '../views/Sessions.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    name: 'Genre',
    path: '/genre/:genre',
    component: Home
  },
  {
    name: 'Sessions',
    path: '/sessions/',
    component: Sessions
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
