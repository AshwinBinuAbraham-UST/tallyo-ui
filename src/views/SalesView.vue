<template>
  <CustomLoader v-if="!salesData"/>
  <div v-if="salesData" class="w-full">
    <SalesChart class="" :salesData="salesData" />
    <ProductDistribution :salesData="salesData" />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SalesChart from '../components/sales/SalesChart.vue'
import ProductDistribution from '@/components/sales/ProductDistribution.vue'
import axios from 'axios'
import CustomLoader from '@/components/customLoader.vue'
import { toast } from 'vue3-toastify'
interface SaleData {
  productid: string
  productname: string
  date: string
  totalsold: string
  totalcost: string
}
const salesData = ref<SaleData[]>([])
const errorMessage = ref('')
const fetchData = async () => {
  try {
    const userCode = localStorage.getItem('userCode')
    const authToken = localStorage.getItem('authToken')
    const response = await axios.get(`http://localhost:3000/store/showSales`, {
      timeout: 10000,
      withCredentials: true,
      headers: {
        userCode: userCode,
        Authorization: authToken,
      },
    })
    salesData.value = response.data.data
    console.log(salesData)
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
    console.error('Error adding order :', errorMessage.value)

  }
}
onMounted(async () => {
  fetchData()
})
</script>
