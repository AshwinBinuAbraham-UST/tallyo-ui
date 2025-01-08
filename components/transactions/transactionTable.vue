<template>
  <CustomLoader v-if="wideTableData.length !== 0 && isLoading" class="w-full h-screen " />
  <div v-if="!isLoading|| wideTableData.length==0" class="mt-8">
    <h4 v-if="$route.name === 'dashboard'" class="text-gray-600">Recent Transactions</h4>

    <div class="flex flex-col mt-6">
      <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div
          class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg"
        >
          <table class="min-w-full">
            <thead>
              <tr>
                <th
                  @click="fetchData"
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200"
                >
                  Transaction Code
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200"
                >
                  UserName
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200"
                >
                  Amount
                </th>

                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200"
                >
                  Date
                </th>
              </tr>
            </thead>

            <tbody v-if="wideTableData.length > 0" class="bg-white w-full">
              <tr v-for="(u, index) in wideTableData" :key="index" class="">
                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="">
                      <div class="text-sm font-medium leading-5 text-gray-900">
                        {{ u.transactionCode }}
                      </div>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ u.username }}
                  </div>
                  <div class="text-sm leading-5 text-gray-500">
                    {{ u.userCode }}
                  </div>
                </td>

                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  <span
                    v-if="u.status == 'success'"
                    class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full"
                    >{{ u.status }}</span
                  >
                  <span
                    v-if="u.status == 'pending'"
                    class="inline-flex px-2 text-xs font-semibold leading-5 text-red-800 bg-red-100 rounded-full"
                    >{{ u.status }}</span
                  >
                </td>

                <td
                  class="px-6 py-4 text-sm leading-5 text-gray-500 border-b border-gray-200 whitespace-nowrap"
                >
                  {{ u.amount }}
                </td>
                <td
                  class="px-6 py-4 text-sm leading-5 text-gray-500 border-b border-gray-200 whitespace-nowrap"
                >
                  {{ new Date(u.createdAt!).toLocaleString() }}
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="wideTableData.length == 0" class="text-gray-400 text-center bg-white w-full">
            No Transactions found
          </div>
          <div class="w-full text-sm bg-white">
            <div class="flex md:justify-center items-center space-x-4">
              <button
                class="px-4 py-2 text-gray-700 rounded hover:underline disabled:cursor-not-allowed"
                :disabled="page === 1"
                @click="changePage(page - 1)"
              >
                Previous
              </button>

              <span class="text-gray-600"> Page {{ page }} of {{ totalPages }} </span>

              <button
                class="px-4 py-2 text-gray-700 rounded hover:underline disabled:cursor-not-allowed"
                :disabled="page === totalPages"
                @click="changePage(page + 1)"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import CustomLoader from '../customLoader.vue'
import { toast } from 'vue3-toastify'
export type TransactionStatus = 'success' | 'failed' | 'pending'
export interface TransactionResponse {
  transactionCode?: string
  username?: string
  status?: TransactionStatus
  createdAt?: Date
  userCode?: string
  amount?: number
}
const wideTableData = ref<TransactionResponse[]>([])
const page = ref(1)
const limit = ref(5)
const totalPages = ref(1)
const isLoading = ref(true)
const errorMessage =ref('')
const fetchData = async () => {
  try {
    const userCode = localStorage.getItem('userCode')
    const authToken = localStorage.getItem('authToken')
    const response = await axios.get(
      `http://localhost:3000/store/allTransactions?page=${page.value}&limit=${limit.value}`,
      {
        timeout: 10000,
        withCredentials: true,
        headers: {
          userCode: userCode,
          Authorization: authToken,
        },
      },
    )

    wideTableData.value = response.data.data.transactions
    totalPages.value = response.data.data.totalPages
    isLoading.value = false
  }  catch (error) {
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
    console.error('Fetching Error:', errorMessage.value)
    console.error(':', error)

  }
}

const changePage = (newPage: number) => {
  if (newPage > 0 && newPage <= totalPages.value) {
    page.value = newPage
    fetchData()
  }
}

onMounted(async () => {
  fetchData()
})
</script>
