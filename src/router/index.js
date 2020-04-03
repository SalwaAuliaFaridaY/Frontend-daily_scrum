import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Daily from '../views/Daily.vue'
import Navbar from '../views/Navbar.vue'
import Footer from '../views/Footer.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/daily',
    name: 'daily',
    components: { default: Daily, header: Navbar, footer: Footer },
    meta: {
      requiresAuth: true
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login')
  } else {
    next()
  }
})

export default router