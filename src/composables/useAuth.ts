import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi, type LoginFormData } from '@/apis/auth'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
export function useAuth() {
  const router = useRouter()
  const isLoading = ref(false)

  const login = async (formData: LoginFormData) => {
    isLoading.value = true

    const result = await authApi.login(formData)
    isLoading.value = false
    if (result.success) {
      await new Promise<void>((resolve) => {
        toast("You've successfully logged in", {
          autoClose: 1000,
          type: 'success',
          position: 'bottom-right',
          transition: 'bounce',
          onClose: () => resolve(),
        })
      })
      router.push('/dashboard')
      return result
    } else {
      toast(result.errorMessage, {
        autoClose: 3000,
        type: 'error',
        position: 'bottom-right',
        transition: 'bounce',
      })
      console.error('Login error details:', result.details)
      return result
    }
  }
  return {
    login,
    isLoading,
  }
}
