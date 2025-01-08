<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-xl p-10 flex flex-row">
      <div>
        <h2 class="text-2xl font-bold mb-4">Verify Transaction</h2>

        <form @submit.prevent="verify">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="productCost">
              Transaction Id
            </label>
            <div
              class="shadow appearance-none cursor-not-allowed border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              {{ transactionCode }}
            </div>
          </div>
           <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="productCount">
              User Name
            </label>
            <div
              class="shadow appearance-none cursor-not-allowed border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              {{ userName }}
            </div>
          </div>
          <div class="mb-4">
            <label class="block underline text-gray-700 text-sm font-bold mb-2" for="productName">
              Enter Secret Code
            </label>
            <input
              id="secretCode"
              v-model="shortCode"
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
              Verify
            </button>
          </div>
        </form>
      </div>
      <div class="w-7 h-7 rounded-full absolute bg-gray-200 top-24 left-[638px]"></div>
      <div class="w-7 h-7 rounded-full absolute bg-gray-200 top-[470px] left-[638px]"></div>
      <div class="w-4 ml-10 border-l-4 border-dotted"></div>
      <div class="pl-5">
        <h2 class="text-2xl font-bold mb-4">Order Details</h2>
        <div v-for="item in selectedTransaction?.transactionItems" :key="item.productId">
          <div class="shadow-md rounded p-2 border-[1px] border-amber-300 flex flex-col text-sm">
            <div class="flex gap-3">
              <span class="text-gray-700 text-sm font-bold">Item :</span>{{ item.productName }}
            </div>
            <div class="flex flex-row gap-4">
              <div class="flex gap-3">
                <span class="text-gray-700 text-sm font-bold">Cost :</span>{{ item.productCost }}
              </div>
              <div class="flex gap-3">
                <span class="text-gray-700 text-sm font-bold">Quantity :</span>{{ item.quantity }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import { toast } from 'vue3-toastify'
import type { Transaction } from '@/constants/types';
const props = defineProps<{
  selectedTransaction?:Transaction
}>()

const shortCode = ref<string>('12345')
const userName = ref<string>('name')
const transactionCode = ref<string>('')
const formData = reactive({
  transactionCode,
  shortCode,
})

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'verified'): void
}>()
const verify = async () => {
  try {
    const userCode = localStorage.getItem('userCode')
    const authToken = localStorage.getItem('authToken')

    const response = await axios.post('http://localhost:3000/store/verifyTransaction', formData, {
      timeout: 10000,
      withCredentials: true,
      headers: {
        userCode: userCode,
        Authorization: authToken,
      },
    })
    if (response.status == 200) {
      toast.success(response.data.message, {
        autoClose: 3000,
        position: 'bottom-right',
      })
      emit('verified')
    }
  } catch (error) {
    console.error('Error adding product:', error)
  }
}

onMounted(() => {
  userName.value = props.selectedTransaction?.username || ''
  transactionCode.value = props.selectedTransaction?.transactionCode||''
})
</script>
