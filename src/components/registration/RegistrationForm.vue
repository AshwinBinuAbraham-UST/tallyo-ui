<template>
  <form class="mt-4 flex flex-col items-stretch w-full" @submit.prevent="register">
    <div class="flex flex-col md:flex-row mb-2">
      <div class="block w-2/5 text-sm text-gray-700">Store Code</div>
      <div
        class="w-full text-md font-semibold px-2 rounded-md border border-gray-200 text-gray-700"
      >
        {{ initialData?.userCode || 'N/A' }}
      </div>
    </div>
    <div class="flex flex-col md:flex-row mb-4">
      <div class="block w-2/5 text-sm text-gray-700">Store Name</div>
      <div
        class="w-full text-md font-semibold px-2 rounded-md border border-gray-200 text-gray-700"
      >
        {{ initialData?.fullName || 'N/A' }}
      </div>
    </div>

    <label class="block mb-3">
      <span class="text-sm text-gray-700">Store Location</span>
      <input
        type="text"
        required
        v-model="formData.location"
        class="block w-full mt-1 px-2 rounded-md border border-gray-200 focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
      />
    </label>
    <label class="block mb-3">
      <span class="text-sm text-gray-700">Phone</span>
      <input
        type="tel"
        required
        v-model="formData.phone"
        class="block w-full px-2 mt-1 border border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
      />
    </label>
    <label class="block mb-3">
      <span class="text-sm text-gray-700">Store Type</span>
      <input
        type="text"
        required
        v-model="formData.type"
        class="block w-full px-2 mt-1 border border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
      />
    </label>
    <label class="block mt-3">
      <span class="text-sm text-gray-700">Temporary Password</span>
      <input
        type="password"
        v-model="formData.password"
        required
        class="block w-full mt-1 border px-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
      />
    </label>

    <div class="mt-6 space-y-2">
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full px-4 py-2 text-sm text-center text-white bg-indigo-600 rounded-md focus:outline-none hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isLoading ? 'Registering...' : 'Register' }}
      </button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import axios from 'axios'
import { toast } from 'vue3-toastify'

interface InitialUserData {
  userCode: string
  fullName?: string
}

interface RegistrationFormData {
  location: string
  type: string
  phone: string
  password: string
}

const props = defineProps<{
  initialData: InitialUserData | null
}>()

const emit = defineEmits<{
  (e: 'next'): void
}>()

const formData = reactive<RegistrationFormData>({
  location: '',
  type: '',
  phone: '',
  password: '',
})

const isLoading = ref(false)
const isRegistered = ref(false)

const register = async () => {
  if (!props.initialData?.userCode) {
    toast('Please complete previous verification step', {
      type: 'warning',
      autoClose: 2000,
    })

    return
  }
  const errorMessage = ref('')
  isLoading.value = true
  try {
    const registrationPayload = {
      ...formData,
      userCode: props.initialData.userCode,
    }

    const response = await axios.post('http://localhost:3000/store/register', registrationPayload, {
      withCredentials: true,
    })

    const userCode = response.data.userCode || response.headers['userCode']

    localStorage.setItem('userCode', userCode)
    localStorage.setItem('userData', JSON.stringify(response.data.data))

    const authToken = response.headers['authorization']
    if (authToken) {
      localStorage.setItem('authToken', authToken)
    }
    isRegistered.value = true
    emit('next')
    toast("You've successfully registered", {
      type: 'success',
      autoClose: 2000,
    })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data)
      errorMessage.value = error.response?.data?.message || 'Registration failed'
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
