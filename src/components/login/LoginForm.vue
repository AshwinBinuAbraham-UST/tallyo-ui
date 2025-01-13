<template>
  <form class="mt-4" @submit.prevent="handleLogin">
    <label class="block">
      <span class="text-sm text-gray-700">UserCode</span>
      <input
        type="text"
        class="block w-full mt-1 px-2 border border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
        v-model="formData.userCode"
        :disabled="isLoading"
      />
    </label>

    <label class="block mt-3">
      <span class="text-sm text-gray-700">Password</span>
      <input
        type="password"
        class="block w-full px-2 border mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
        v-model="formData.password"
        :disabled="isLoading"
      />
    </label>
    <div>
      <label class="inline-flex items-center">
        <input
          type="checkbox"
          class="text-indigo-600 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
          :disabled="isLoading"
        />
        <span class="mx-2 text-sm text-gray-600">Remember me</span>
      </label>
    </div>

    <div class="flex items-center justify-between mt-4">
      <div>
        <a
          class="block text-sm text-indigo-700 fontme hover:underline"
          @click.prevent="handleForgotPassword"
          href="#"
          :class="{ 'pointer-events-none opacity-50': isLoading }"
        >
          Forgot your password?
        </a>
      </div>
      <div>
        <a
          class="block text-sm text-indigo-700 fontme hover:underline"
          @click.prevent="$emit('show-registration')"
          href="#"
          :class="{ 'pointer-events-none opacity-50': isLoading }"
        >
          New User? Register
        </a>
      </div>
    </div>

    <div class="mt-6">
      <button
        type="submit"
        class="w-full px-4 py-2 text-sm text-center text-white rounded-md focus:outline-none relative"
        :class="isLoading
          ? 'bg-amber-400 cursor-not-allowed'
          : 'bg-amber-400 hover:bg-amber-500'"
        :disabled="isLoading"
      >
        <span class="flex items-center justify-center">
          <svg
            v-if="isLoading"
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ isLoading ? 'Signing In...' : 'Sign in' }}
        </span>
      </button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { reactive } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useAuth } from '@/composables/useAuth'
import type { LoginFormData } from '@/apis/auth'
import { useAuthStore } from '@/stores/login'
import router from '@/router'

const authStore = useAuthStore()

const handleLogin = async () => {
   if (!formData.userCode || !formData.password) {
    toast.error('Please enter both UserCode and Password', {
      autoClose: 2000,
      position: 'bottom-right'
    })
    return
  }
  try {
    await authStore.performLogin(formData)
  } catch (error) {
    console.error(':', error)
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response
        ? error.response.data.message || 'Login failed'
        : error.request
          ? 'No response from server'
          : 'Error in login request'

      const er = {
        success: false,
        errorMessage,
        details: error.response?.data,
      }
      console.error(er)
      if (errorMessage == 'Login failed') {
        alert(errorMessage)
        router.push('/')
      }
    }

    console.error({
      success: false,
      errorMessage: 'Unexpected error occurred',
      details: error,
    })
  }
}

const {  isLoading } = useAuth()

const formData = reactive<LoginFormData>({
  userCode: 'STR10',
  password: '12345',
})

const emit = defineEmits<{
  (e: 'show-forgot-password', userCode: string): void
  (e: 'show-registration'): void
}>()

const handleForgotPassword = async () => {
  if (!formData.userCode) {
    toast.error('Enter your UserCode', {
      autoClose: 2000,
      position: 'bottom-right'
    })
    return
  }

  try {
    const response = await axios.post('http://localhost:3000/store/forgotPassword',
      { userCode: formData.userCode },
      { withCredentials: true }
    )

    emit('show-forgot-password', formData.userCode)

    toast.success(response.data.message, {
      autoClose: 3000,
      position: 'bottom-right'
    })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    toast.error(
      error.response?.data?.message || 'Something went wrong. Please try again.',
      {
        autoClose: 3000,
        position: 'bottom-right'
      }
    )
  }
}
</script>
