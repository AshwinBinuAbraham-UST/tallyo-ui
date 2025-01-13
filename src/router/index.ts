import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import Login from '../views/AppLogin.vue'
import Dashboard from '../views/AppDashboard.vue'
import Products from '../views/Products.vue'
import { useAuthStore } from '@/stores/login'
import { toast } from 'vue3-toastify'
import MakeOrders from '@/views/MakeOrders.vue'
import OrdersCart from '@/views/OrdersCart.vue'
import Transactions from '@/views/Transactions.vue'
import EditProfile from '@/views/EditProfile.vue'
import SalesView from '@/views/SalesView.vue'
import AdminSummary from '@/views/AdminSummary.vue'
import AdminUsers from '@/views/AdminUsers.vue'
import Settings from '@/views/Settings.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: { layout: 'empty' },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/products',
    name: 'products',
    component: Products,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/makeOrders',
    name: 'makeOrders',
    component: MakeOrders,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/ordersCart',
    name: 'ordersCart',
    component: OrdersCart,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/transactions',
    name: 'transactions',
    component: Transactions,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/editProfile',
    name: 'editProfile',
    component: EditProfile,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/sales',
    name: 'sales',
    component: SalesView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/adminSummary',
    name: 'adminSummary',
    component: AdminSummary,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/adminUsers',
    name: 'adminUsers',
    component: AdminUsers,
    meta: {
      requiresAuth: true,
    },
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
localStorage.getItem('isAuthenticated')
  if (to.meta.requiresAuth && (!authStore.isAuthenticated && localStorage.getItem('isAuthenticated')!=='true')) {
    next('/')
    alert('login')
    toast('Please Login', {
      autoClose: 3000,
      type: 'error',
      position: 'bottom-right',
      transition: 'bounce',
    })

    return
  }

  next()
})


export default router
