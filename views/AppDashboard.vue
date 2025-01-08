<template>
  <div>
    <Breadcrumb breadcrumb="Dashboard" />
    <div
      :style="{
        background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${userData.__store__.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
      class="w-full flex flex-col items-center justify-center inset-0 bg-cover bg-center rounded-md h-fit py-3"
    >
      <img :src="userData.__store__.logoUrl!" class="z-10 w-10 mt-1 bg-gray-900 rounded-full" />
      <h1
        class="z-10 text-5xl text-center text-white text-ellipsis drop-shadow-md font-semibold shadow-black"
      >
        {{ userData.fullName }}
      </h1>
      <vue3-star-ratings
        v-model="rating"
        :starSize="26"
        starColor="#ff9800"
        inactiveColor="#000000"
        :numberOfStars="5"
        :disableClick="true"
      />
      <span class="z-10 text-amber-500 text-sm font-semibold">{{ rating }}</span>
      <span class="z-10 text-amber-100 text-sm font-semibold">{{
        userData.__store__.storeLocation
      }}</span>
    </div>
    <div class="mt-4">
      <div class="flex flex-wrap -mx-6">
        <div class="px-4 md:px-6 w-1/3">
          <div
            class="flex items-center text-sm md:text-md flex-col md:flex-row md:px-5 py-3 md:py-6 bg-white rounded-md shadow-sm"
          >
            <div class="p-3 bg-indigo-600 bg-opacity-75 rounded-full">
              <svg
                class="w-8 h-8 text-white"
                viewBox="0 0 28 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.2 9.08889C18.2 11.5373 16.3196 13.5222 14 13.5222C11.6804 13.5222 9.79999 11.5373 9.79999 9.08889C9.79999 6.64043 11.6804 4.65556 14 4.65556C16.3196 4.65556 18.2 6.64043 18.2 9.08889Z"
                  fill="currentColor"
                />
                <path
                  d="M25.2 12.0444C25.2 13.6768 23.9464 15 22.4 15C20.8536 15 19.6 13.6768 19.6 12.0444C19.6 10.4121 20.8536 9.08889 22.4 9.08889C23.9464 9.08889 25.2 10.4121 25.2 12.0444Z"
                  fill="currentColor"
                />
                <path
                  d="M19.6 22.3889C19.6 19.1243 17.0927 16.4778 14 16.4778C10.9072 16.4778 8.39999 19.1243 8.39999 22.3889V26.8222H19.6V22.3889Z"
                  fill="currentColor"
                />
                <path
                  d="M8.39999 12.0444C8.39999 13.6768 7.14639 15 5.59999 15C4.05359 15 2.79999 13.6768 2.79999 12.0444C2.79999 10.4121 4.05359 9.08889 5.59999 9.08889C7.14639 9.08889 8.39999 10.4121 8.39999 12.0444Z"
                  fill="currentColor"
                />
                <path
                  d="M22.4 26.8222V22.3889C22.4 20.8312 22.0195 19.3671 21.351 18.0949C21.6863 18.0039 22.0378 17.9556 22.4 17.9556C24.7197 17.9556 26.6 19.9404 26.6 22.3889V26.8222H22.4Z"
                  fill="currentColor"
                />
                <path
                  d="M6.64896 18.0949C5.98058 19.3671 5.59999 20.8312 5.59999 22.3889V26.8222H1.39999V22.3889C1.39999 19.9404 3.2804 17.9556 5.59999 17.9556C5.96219 17.9556 6.31367 18.0039 6.64896 18.0949Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <div class="md:mx-5 text-center">
              <h4 class="text-2xl font-semibold text-gray-700">{{ storeSummary?.totalUsers }}</h4>
              <div class="text-gray-500">New Users</div>
            </div>
          </div>
        </div>

        <div class="px-4 md:px-6 w-1/3">
          <div
            class="flex items-center text-sm md:text-md flex-col md:flex-row md:px-5 py-3 md:py-6 bg-white rounded-md shadow-sm"
          >
            <div class="p-3 bg-blue-600 bg-opacity-75 rounded-full">
              <svg
                class="w-8 h-8 text-white"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.19999 1.4C3.4268 1.4 2.79999 2.02681 2.79999 2.8C2.79999 3.57319 3.4268 4.2 4.19999 4.2H5.9069L6.33468 5.91114C6.33917 5.93092 6.34409 5.95055 6.34941 5.97001L8.24953 13.5705L6.99992 14.8201C5.23602 16.584 6.48528 19.6 8.97981 19.6H21C21.7731 19.6 22.4 18.9732 22.4 18.2C22.4 17.4268 21.7731 16.8 21 16.8H8.97983L10.3798 15.4H19.6C20.1303 15.4 20.615 15.1004 20.8521 14.6261L25.0521 6.22609C25.2691 5.79212 25.246 5.27673 24.991 4.86398C24.7357 4.45123 24.2852 4.2 23.8 4.2H8.79308L8.35818 2.46044C8.20238 1.83722 7.64241 1.4 6.99999 1.4H4.19999Z"
                  fill="currentColor"
                />
                <path
                  d="M22.4 23.1C22.4 24.2598 21.4598 25.2 20.3 25.2C19.1403 25.2 18.2 24.2598 18.2 23.1C18.2 21.9402 19.1403 21 20.3 21C21.4598 21 22.4 21.9402 22.4 23.1Z"
                  fill="currentColor"
                />
                <path
                  d="M9.1 25.2C10.2598 25.2 11.2 24.2598 11.2 23.1C11.2 21.9402 10.2598 21 9.1 21C7.9402 21 7 21.9402 7 23.1C7 24.2598 7.9402 25.2 9.1 25.2Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <div class="md:mx-5 text-center">
              <h4 class="text-2xl font-semibold text-gray-700">
                {{ storeSummary?.totalTransactions }}
              </h4>
              <div class="text-gray-500">Total Orders</div>
            </div>
          </div>
        </div>

        <div class="px-4 md:px-6 w-1/3">
          <div
            class="flex items-center text-sm md:text-md flex-col md:flex-row md:px-5 py-3 md:py-6 bg-white rounded-md shadow-sm"
          >
            <div class="p-3 bg-pink-600 bg-opacity-75 rounded-full">
              <svg
                class="w-8 h-8 text-white"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.99998 11.2H21L22.4 23.8H5.59998L6.99998 11.2Z"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
                <path
                  d="M9.79999 8.4C9.79999 6.08041 11.6804 4.2 14 4.2C16.3196 4.2 18.2 6.08041 18.2 8.4V12.6C18.2 14.9197 16.3196 16.8 14 16.8C11.6804 16.8 9.79999 14.9197 9.79999 12.6V8.4Z"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
            </div>

            <div class="md:mx-5 text-center">
              <h4 class="text-2xl font-semibold text-gray-700">{{ storeSummary?.totalProducts }}</h4>
              <div class="text-gray-500">Products</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8"></div>

    <TransactionTable />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Breadcrumb from '../partials/AppBreadcrumb.vue'
import TransactionTable from '@/components/transactions/transactionTable.vue'
import axios from 'axios'
import router from '@/router'
import { useStoreInfo } from '@/stores/store'
import { type Summary, type User } from '@/constants/types'
const storeUser = useStoreInfo()
const userData: User = storeUser.userData!
const storeSummary = ref<Summary>()
const rating = ref(0)
const fetchSummary = async () => {
  try {
    const userCode = localStorage.getItem('userCode')
    const authToken = localStorage.getItem('authToken')
    const response = await axios.get('http://localhost:3000/store/overallSummary', {
      withCredentials: true,
      headers: {
        userCode: userCode,
        Authorization: authToken,
      },
    })
    storeSummary.value = response.data.data
    rating.value = storeSummary.value?.rating as number

  } catch (error) {
    console.error('Error fetching store:', error)
    if (axios.isAxiosError(error)) {
      const errorMessage: string = error.response
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

      if (errorMessage.includes('cookie not found')) {
        alert('Session expired , Please Login Again')
        router.push('/')
      }
    }
  }
}

onMounted(() => {
  fetchSummary()
})
</script>
