<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <form class="mt-4" @submit.prevent="verify">
    <label class="block">
      <span class="text-sm text-gray-700">OTP</span>
      <input
        type="text"
        class="block w-full px-2 border mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
        v-model="formData.otp"
      />
    </label>
    <label class="block">
      <span class="text-sm text-gray-700">New Password</span>
      <input
        type="text"
        class="block w-full mt-1 px-2 border border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
        v-model="formData.password"
      />
    </label>

    <label class="block mt-3">
      <span class="text-sm text-gray-700">Confirm Password</span>
      <input
        type="password"
        class="block w-full mt-1 px-2 border border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
        v-model="formData.confirmPassword"
      />
    </label>

    <div class="mt-6">
      <button
        type="submit"
        class="w-full px-4 py-2 text-sm text-center text-white bg-indigo-600 rounded-md focus:outline-none hover:bg-indigo-500"
      >
        Set Password
      </button>
    </div>
  </form>
  <!-- <button class="rounded-xl mt-8 bg-black w-10 h-10" @click="refresh">ok</button> -->
</template>

<script lang="ts" setup>
import axios from 'axios'

const props = defineProps<{
  userCode: string
}>()

const emit = defineEmits<{
  (e: 'show-login'): void
  (e: 'show-registration'): void
}>()
import router from '@/router'
const formData = {
  userCode: props.userCode,
  otp: '',
  password: '',
  confirmPassword: '',
}

const verify = async () => {
  // console.log(formData, 'oojoj')
  try {
    const response = await axios.post('http://localhost:3000/store/changePassword', formData)
    localStorage.setItem('userdata', response.data.data)
    emit('show-login')
    alert(response.data.message)
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


</script>
