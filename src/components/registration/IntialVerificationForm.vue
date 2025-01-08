<template>
  <form class="mt-4" @submit.prevent="verify">
    <label class="block">
      <span class="text-sm text-gray-700">User Code</span>
      <input
        type="text"
        v-model="formData.userCode"
        required
        class="block w-full mt-1 px-2 border border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
      />
    </label>

    <div class="mt-6 space-y-2">
      <button
        type="submit"
        v-if="!isVerified.valueOf()"
        :disabled="isLoading"
        class="w-full px-4 py-2 text-sm text-center text-white bg-indigo-600 rounded-md focus:outline-none hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isLoading ? 'Verifying...' : 'Verify' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import axios from 'axios'
import { toast } from 'vue3-toastify'

interface UserData {
  userCode: string
  fullName?: string
  email?: string
}

const emit = defineEmits<{
  (e: 'next', data: UserData): void
}>()
const formData = reactive({
  userCode: '',
})

const userData = ref<UserData | null>(null)
const isLoading = ref(false)
const isVerified = ref(false)
const errorMessage = ref('')
const verify = async () => {
  errorMessage.value = ''
  isLoading.value = true
  userData.value = null

  try {
    const response = await axios.post('http://localhost:3000/store/getUser', formData)

    if (response.data && response.data.data) {
      userData.value = response.data.data

      if (response.data.message) {
        toast(response.data.message, {
          type: 'loading',
          autoClose: 2000,
        })
      }
      isVerified.value = true

      emit('next', response.data.data)
    } else {
      throw new Error('Invalid response format')
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data)
      errorMessage.value = error.response?.data?.message || 'Verification failed'
    } else {
      errorMessage.value = 'An unexpected error occurred'
    }
    toast(errorMessage.value, {
      type: 'error',
      autoClose: 2000,
    })
    console.error('Verification Error:', error.response?.data?.message)
  } finally {
    isLoading.value = false
  }
}

</script>

<style scoped>
.error-message {
  color: red;
  margin-top: 10px;
}
</style>
