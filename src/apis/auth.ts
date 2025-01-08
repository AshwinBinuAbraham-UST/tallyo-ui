import { useStoreInfo } from '@/stores/store'
import axios from 'axios'

export interface LoginFormData {
  userCode: string
  password: string
}

export const authApi = {
  async login(formData: LoginFormData) {
  const userStore = useStoreInfo()

    try {
      const response = await axios.post('http://localhost:3000/store/login', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      })


      // Extract user code and auth token
      const userCode = response.data.userCode || response.headers['usercode']
      const authToken = response.headers['authorization']
      const response2 = await axios.get('http://localhost:3000/store/me', {
        withCredentials: true,
        headers: {
          userCode: userCode,
          Authorization: authToken,
        },
      })
      userStore.userData = response.data.data
      return {
        userCode,
        authToken,
        success: true,
      }
    } catch (error: any) {
      // Standardize error handling
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response
          ? error.response.data.message || 'Login failed'
          : error.request
            ? 'No response from server'
            : 'Error in login request'

        return {
          success: false,
          errorMessage,
          details: error.response?.data,
        }
      }

      return {
        success: false,
        errorMessage: 'Unexpected error occurred',
        details: error,
      }
    }
  },
}
