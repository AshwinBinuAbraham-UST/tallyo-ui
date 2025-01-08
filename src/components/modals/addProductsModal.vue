<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-xl p-6 w-96">
      <h2 class="text-2xl font-bold mb-4">New Product Details</h2>

      <form @submit.prevent="submitProduct">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="productName">
            Product Name
          </label>
          <input
            id="productName"
            v-model="productName"
            type="text"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="productCost">
            Product Cost
          </label>
          <input
            id="productCost"
            v-model.number="productCost"
            type="number"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="productCount">
            Product Count
          </label>
          <input
            id="productCount"
            v-model.number="productCount"
            type="number"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="categoryName">
            Category Name
          </label>
          <input
            id="categoryName"
            v-model="categoryName"
            type="text"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="productImage">
            Product Image
          </label>
          <div class="flex flex-row">
          <input
            id="productImage"
            @change="handleFileUpload"
            type="file"
            accept="image/*"
            class="shadow appearance-none border rounded w-2/3 py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <div v-if="imagePreview" class="ml-2">
            <img :src="imagePreview" alt="Product Preview" class="max-w-full h-12 rounded" />
          </div>
          </div>
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
            Add Product
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

const productName = ref<string>('')
const productCost = ref<number | null>(null)
const productCount = ref<number | null>(null)
const categoryName = ref<string>('')
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)


const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target && target.files)
  imageFile.value = target.files[0]

  if (imageFile.value) {
    // imageFile.value = file

    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result
      if (typeof result === 'string') {
        imagePreview.value = result
      }
    }
    reader.readAsDataURL(imageFile.value)
  }
}

const submitProduct = async () => {
  try {
    const formData = new FormData()

    formData.append('productName', productName.value)
    formData.append('productCost', productCost.value?.toString() ?? '')
    formData.append('productCount', productCount.value?.toString() ?? '')
    formData.append('categoryName', categoryName.value)

    if (imageFile.value) {
      formData.append('productImage', imageFile.value)
    }

    const userCode = localStorage.getItem('userCode')
    const authToken = localStorage.getItem('authToken')
    const response = await axios.post('http://localhost:3000/store/addProduct', formData, {
      timeout: 10000,
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
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
  }
}

// Reset form method
const resetForm = () => {
  productName.value = ''
  productCost.value = null
  productCount.value = null
  categoryName.value = ''
  imageFile.value = null
  imagePreview.value = null
}
</script>
