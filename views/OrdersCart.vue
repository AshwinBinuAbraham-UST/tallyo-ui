<template>
  <AppBreadcrumb breadcrumb="OrdersCart" />
  <CustomLoader v-if="isLoading" />
  <div v-if="!isLoading || pendingtransactionsData.length === 0">
    <h1 v-if="pendingtransactionsData.length === 0">No Transactions Found!</h1>
    <div
      class="w-full bg-white flex my-2 flex-row"
      v-for="(u, index) in pendingtransactionsData"
      :key="index"
    >
      <div
        class="md:w-1/4 w-2/5 flex items-center justify-center border-r-[5px] border-r-gray-200 border-dotted"
      >
        <div class="p-3 px-5">
          <h1 class="md:text-xl font-normal font-mono w-30">
            {{ new Date(u.createdAt).toLocaleString() }}
          </h1>
        </div>
        <div class="relative m-0 pt-1">
          <span
            class="absolute hidden md:block top-9 bg-gray-200 rounded-full p-3 right-[-15px]"
          ></span>
          <span class="absolute hidden -top-12 bg-gray-200 rounded-full p-3 right-[-35px]"></span>
        </div>
      </div>
      <div class="w-3/4 flex flex-col md:flex-row items-center justify-center p-5">
        <div>
          <h1 class="text-center flex flex-col">
            Transaction Id : <span class="font-semibold">{{ u.transactionCode }}</span>
          </h1>
        </div>
        <div class="flex flex-col md:text-left md:px-6 md:w-3/5">
          <div class="md:grid md:grid-cols-2 gap-4">
            <h1 class="">
              User Id : <span class="font-semibold">{{ u.userCode }}</span>
            </h1>
            <h1 class=" ">
              User Name: <span class="font-semibold">{{ u.username }}</span>
            </h1>
          </div>
          <div class="md:grid md:grid-cols-2 mt-2 gap-4">
            <h1 class="">
              Amount : <span class="bg-green-100 px-3 py-1">{{ u.amount }} Rs</span>
            </h1>
            <h1 class="">
              Status : <span class="px-2 text-red-700 underline capitalize">{{ u.status }}</span>
            </h1>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <button
            @click="generateInvoice(u)"
            class="mt-3 md:mt-0 text-xs bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-md text-white"
          >
            Download Reciept
          </button>
          <button
            @click="verifyTransaction(u!)"
            class="mt-3 md:mt-0 bg-orange-500 hover:bg-orange-600 px-2 py-1 rounded-md text-white"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  </div>
  <VerifyTransactionModal
    v-if="showVerifyTransactionModal"
    :selectedTransaction
    @cancel="showVerifyTransactionModal = false"
    @verified="showVerifyTransactionModal = false"
  />
</template>

<script lang="ts" setup>
import CustomLoader from '@/components/customLoader.vue'
import VerifyTransactionModal from '@/components/modals/verifyTransactionModal.vue'
import AppBreadcrumb from '@/partials/AppBreadcrumb.vue'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { toast } from 'vue3-toastify'
import type { Transaction } from '@/constants/types'

const isLoading = ref(true)
const totalPages = ref(1)
const showVerifyTransactionModal = ref(false)
const selectedTransaction = ref<Transaction>()
const pendingtransactionsData = ref<Transaction[]>([])
const errorMessage =ref('')
const generateInvoice = (transaction: Transaction) => {
  console.log(transaction)
  const doc = new jsPDF({

  // orientation: "portrait",
  // unit: "in",
  // format: [4, 2]
  });
  autoTable(doc, {
  theme:'grid',
  head: [['Item Name','Product Cost' ,'Quantity', 'Amount']],
  body: [
    ['Burger', '25','3', '75'],
  ],
})
  // doc.text(JSON.stringify(transaction), 1, 1)
  doc.save('a4.pdf')
}
const verifyTransaction = (transaction: Transaction) => {
  selectedTransaction.value = transaction
  showVerifyTransactionModal.value = true
}
const fetchData = async () => {
  try {
    const userCode = localStorage.getItem('userCode')
    const authToken = localStorage.getItem('authToken')
    const response = await axios.get(`http://localhost:3000/store/allTransactions`, {
      timeout: 10000,
      withCredentials: true,
      headers: {
        userCode: userCode,
        Authorization: authToken,
      },
    })
    pendingtransactionsData.value =
      response.data?.data?.transactions?.filter(
        (transaction:Transaction) => transaction.status === 'pending',
      ) || []
    totalPages.value = response.data.data.totalPages
    isLoading.value = false
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data)
      errorMessage.value = error.response?.data?.message || 'Something went wrong'
    } else {
      errorMessage.value = 'An unexpected error occurred'
    }
    toast(errorMessage.value, {
      type: 'error',
      autoClose: 2000,
    })
    console.error('Error fetching data :', errorMessage.value)
  }
}

onMounted(async () => {
  fetchData()
})
</script>
