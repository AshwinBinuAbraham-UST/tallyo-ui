<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-xl p-6 w-96">
      <h2 class="text-2xl font-bold mb-4">New Product Details</h2>

      <form @submit.prevent="submitCategories">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="productName">
            Category Name
          </label>
          <input

            id="productName"
            v-model="categoryName"
            type="text"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div class="flex items-center justify-between">
          <button
            @click="$emit('cancel')"
            class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Category
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { toast } from 'vue3-toastify';
import router from '@/router';

const productName = ref<string>('')
const productCost = ref<number | null>(null)
const productCount = ref<number | null>(null)
const categoryName = ref<string>(''); // Holds the input value
const categories = ref<{ categoryName: string }[]>([]);

const submitCategories = async () => {
  try {
    categories.value.push({categoryName:categoryName.value})
    const userCode = localStorage.getItem('userCode')
    const authToken = localStorage.getItem('authToken')
    const response = await axios.post('http://localhost:3000/store/addCategories', categories.value, {
      timeout: 10000,
      withCredentials: true,
      headers: {
        userCode: userCode,
        Authorization: authToken,
      },
    })
    if (response.status == 200)
    {
       toast.success(response.data.message, {
      autoClose: 3000,
      position: 'bottom-right'
    })
    }
    resetForm()
  } catch (error) {
    console.error('Error adding product:', error)
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

const resetForm = () => {
  productName.value = ''
  productCost.value = null
  productCount.value = null
  categoryName.value = ''

}
</script>
