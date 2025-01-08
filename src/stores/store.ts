import { ref} from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/constants/types'

export const useStoreInfo = defineStore('storeUser', () => {
  const userData = ref<User>()
  return { userData}
})
