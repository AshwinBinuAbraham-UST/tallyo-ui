import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { LoginFormData } from '@/apis/auth';
import { useAuth } from '@/composables/useAuth';

export const useAuthStore = defineStore('login', () => {
  const user = ref();
  const isAuthenticated=ref(false)
  const { login } = useAuth()
   const performLogin = async (formData: LoginFormData) => {
     try {
       const userData = await login(formData)
       user.value = userData
       isAuthenticated.value = true
       localStorage.setItem('authToken',userData.authToken)
       localStorage.setItem('userCode', userData.userCode)
       localStorage.setItem('isAuthenticated','true')
     } catch (error) {
       isAuthenticated.value = false
       throw error
     }
   }
  return { performLogin,user,isAuthenticated}
})
