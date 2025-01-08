import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Orders } from '@/constants/types'

export const useOrderStore = defineStore('orders', () => {
  const ordersData = ref<Orders[]>()
  return { ordersData}
})
