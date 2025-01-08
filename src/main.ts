import './assets/tailwind.css'

import { createApp } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import DashboardLayout from './components/DashboardLayout.vue'
import EmptyLayout from './components/EmptyLayout.vue'

import App from './App.vue'
import router from './router'
const app = createApp(App)
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'
import { createPinia } from 'pinia'

app.use(Vue3Toastify, {
  autoClose: 3000,
} as ToastContainerOptions)
import vue3StarRatings from 'vue3-star-ratings'

app.component('vue3-star-ratings', vue3StarRatings)
app.component('default-layout', DashboardLayout)
app.component('empty-layout', EmptyLayout)
app.use(createPinia())
app.use(router).use(VueApexCharts).mount('#app')
