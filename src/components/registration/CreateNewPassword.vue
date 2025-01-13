eslint-disable @typescript-eslint/no-unused-vars
<template>
  <form class="mt-4" @submit.prevent="verify">
    <label class="block">
      <span class="text-sm text-gray-700">New Password</span>
      <input
        type="text"
        class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
        v-model="formData.password"
      />
    </label>

    <label class="block mt-3">
      <span class="text-sm text-gray-700">Confirm Password</span>
      <input
        type="password"
        class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
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

interface InitialUserData {
  userCode: string
  fullName?: string
}
const props = defineProps<{
  userData: InitialUserData | null
}>()
import router from '@/router'
import { toast } from 'vue3-toastify'
import { ref } from 'vue';
const formData = {
  userCode: props.userData?.userCode,
  password: '',
  confirmPassword: '',
}
const errorMessage = ref('')
const verify = async () => {
  try {
    const response = await axios.post('http://localhost:3000/store/setNewPassword', formData)
    localStorage.setItem('userdata', response.data.data)
    await new Promise<void>((resolve) => {
      toast(response.data.message, {
        type: 'loading',
        autoClose: 2000,
        onClose: () => resolve(),
      })
    })
    router.push('/dashboard')
  } catch (error) {
     if (axios.isAxiosError(error)) {
      errorMessage.value = error.response?.data?.message || 'Something went wrong'
    } else {
      errorMessage.value = 'An unexpected error occurred'
    }
    toast(errorMessage.value, {
      type: 'error',
      autoClose: 2000,
    })
    console.error('Verification Error:', errorMessage.value)
  }
}
</script>

