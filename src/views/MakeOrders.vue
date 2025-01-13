<template>
  <AppBreadcrumb breadcrumb="makeOrders" />
  <CustomLoader v-if="isLoading" />
  <div v-if="!isLoading">
    <div class="font-serif">MENU</div>
    <div class="w-full flex flex-row mb-5">
      <div class="flex flex-col md:flex-row w-full md:items-center">
        <div
          class="w-full Font-medium md:w-fit px-2 border-[1px] rounded-md border-gray-400 bg-white"
        >
          <label class="mx-2 font-medium">UserCode</label>
          <input
            @change="getUser"
            class="border px-2 focus:border-gray-200 focus:outline-none"
            v-model="employeeCode"
            type="text"
            required
            id="employeeCode"
          />
        </div>

        <div class="flex flex-row ml-2 mt-3 md:mt-0 rounded-md px-2 bg-green-50">
          <span v-if="employee?.fullName" class="mx-2 font-semibold">User Found:</span>
          {{ employee?.fullName }}
        </div>
      </div>
      <div class="flex w-full text-xs h-fit md:text-md md:w-2/5 flex-row justify-end">
        <button
          @click="addToCart"
          class="bg-blue-500 px-2 py-1 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:shadow-outline"
        >
          Add to Cart
        </button>
        <button
          @click="sendOrders"
          class="bg-orange-500 ml-3 px-2 py-1 hover:bg-orange-600 text-white font-bold md:py-2 md:px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Make Order
        </button>
      </div>
    </div>
    <div class="flex flex-row w-full justify-end items-center">
      <div
        class="w-1/3 flex flex-row px-2 py-1 items-center text-sm text-gray-700 placeholder-gray-400 bg-white border border-b border-gray-400 rounded-l rounded-r appearance-none sm:rounded-l-none focus:text-gray-700"
      >
        <svg viewBox="0 0 24 24" class="w-4 h-4 text-gray-500 fill-current">
          <path
            d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"
          />
        </svg>

        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search categories or products..."
          class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
        />
      </div>
    </div>
    <section>
      <h2 v-if="CategoryData?.length == 0">No Products Found!</h2>
      <div
        :class="[
          'mt-8 border-b-2 bg-gray-100 border-yellow-300 rounded-md',
          ,
          u.__products__?.length ? 'block' : 'hidden',
        ]"
        v-for="u in filteredCategories"
        :key="u._id"
      >
        <h1
          :class="['font-semibold underline bg-white p-1 border-2 border-b-yellow-300 text-center']"
        >
          {{ u.categoryName }}
        </h1>
        <div class="grid md:grid-cols-2">
          <div
            v-for="(v, index) in u.__products__"
            :class="[
              'p-2 mx-2  shadow-sm grid-cols-2 my-2 rounded-lg border-b border-gray-200',
              v.productCount ? 'block' : 'hidden',
              isSelectedProduct(v.productCode) ? 'bg-amber-200' : 'bg-white hover:bg-gray-100',
            ]"
            :key="index"
          >
            <div v-if="v.productCount" class="flex flex-row justify-between h-full p-2">
              <div class="flex flex-col">
                <h1 class="font-semibold">{{ v.productName }}</h1>
                <div class="flex flex-col h-full justify-center ml-2">
                  <h2>Cost: {{ v.productCost }}</h2>
                  <h2>Available: {{ v.productCount }}</h2>

                  <div
                    class="flex items-center bg-orange-500 hover:bg-orange-600 text-white font-bold rounded focus:outline-none focus:shadow-outline"
                  >
                    <button
                      @click="decrementCount(v.productCode)"
                      class="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-l hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span class="relative px-1 w-10 flex items-center justify-center">
                      {{
                        isSelectedProduct(v.productCode)
                          ? SelectedProducts.find((p) => p.productCode === v.productCode)
                              ?.productCount
                          : 'Add'
                      }}</span
                    >
                    <button
                      @click="incrementCount(v.productCode)"
                      class="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-r hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <img :src="v.imageUrl!" class="rounded-md shadow-md h-44 w-44" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import AppBreadcrumb from '@/partials/AppBreadcrumb.vue'
import { useOrderStore } from '@/stores/orders'
import CustomLoader from '@/components/customLoader.vue'
import type { Category, Orders, Product, User } from '@/constants/types'
const orderStore = useOrderStore()
const isLoading = ref(true)
const SelectedProducts = ref<Partial<Product>[]>([])
const searchTerm = ref('')
const employee = ref<User>()
const employeeCode = ref('')
const CategoryData = ref<Category[]>()
const errorMessage = ref('')

const fetchData = async () => {
  try {
    const userCode = localStorage.getItem('userCode')
    const authToken = localStorage.getItem('authToken')
    const response = await axios.get(`http://localhost:3000/store/categories`, {
      timeout: 10000,
      withCredentials: true,
      headers: {
        userCode: userCode,
        Authorization: authToken,
      },
      // params: {
      //   searchTerm: searchTerm.value,
      //   category: category.value,
      // },
    })
    CategoryData.value = response.data.data
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
const isSelectedProduct = (productCode: string) => {
  return SelectedProducts.value.some(
    (SelectedProduct) => SelectedProduct.productCode === productCode,
  )
}
const filteredCategories = computed(() => {
  const search = searchTerm.value.toLowerCase().trim()
  if (!search) return CategoryData.value
  return CategoryData.value!.map((category: Category) => {
    if (category.categoryName.toLowerCase().includes(search)) {
      return category
    }

    const matchingProducts = category.__products__?.filter((product) =>
      product.productName.toLowerCase().includes(search),
    )

    if (matchingProducts?.length) {
      return {
        ...category,
        products: matchingProducts,
      }
    }
    return null
  }).filter((category) => category !== null)
})
const incrementCount = (productCode: string) => {
  const existingProductIndex = SelectedProducts.value.findIndex(
    (p) => p.productCode === productCode,
  )

  if (existingProductIndex !== -1) {
    SelectedProducts.value[existingProductIndex].productCount! += 1
  } else {
    const p: Partial<Product> = {
      productCode,
      productCount: 1,
    }
    SelectedProducts.value.push(p)
  }
}

const addToCart = () => {
  if (!employeeCode.value) {
    toast.warn('Enter the UserCode', {
      autoClose: 3000,
      position: 'bottom-right',
    })
    return
  }
  if (!SelectedProducts.value.length) {
    toast.warn('Select atleast 1 Product to make order', {
      autoClose: 3000,
      position: 'bottom-right',
    })
    return
  }
  const d = {
    empCode: employeeCode.value,
    orders: SelectedProducts.value,
  }
  console.log('po', d)
  if (!orderStore.ordersData) {
    orderStore.ordersData = []
  }
  orderStore.ordersData.push(d)
  console.log('oooohk', orderStore)
  SelectedProducts.value = []
  toast.success('Orders added to the Queue', {
    autoClose: 3000,
    position: 'bottom-right',
  })
}
const sendOrders = async () => {
  try {
    const userCode = localStorage.getItem('userCode')
    const authToken = localStorage.getItem('authToken')
    console.log(orderStore.ordersData)
    if (!orderStore.ordersData?.length) {
      toast.warn('Add Orders First', {
        autoClose: 3000,
        position: 'bottom-right',
      })
      return
    }
    const response = await axios.post(
      'http://localhost:3000/store/sendOrder',
      orderStore.ordersData,
      {
        timeout: 10000,
        withCredentials: true,
        headers: {
          userCode: userCode,
          Authorization: authToken,
        },
      },
    )
    if (response.status == 200) {
      toast.success(response.data.message, {
        autoClose: 3000,
        position: 'bottom-right',
      })
    }

    orderStore.ordersData = []
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

const decrementCount = (productCode: string) => {
  const existingProductIndex = SelectedProducts.value.findIndex(
    (p) => p.productCode === productCode,
  )

  if (existingProductIndex !== -1) {
    if (SelectedProducts.value[existingProductIndex].productCount! > 1) {
      SelectedProducts.value[existingProductIndex].productCount! -= 1
    } else {
      SelectedProducts.value.splice(existingProductIndex, 1)
    }
  }
}

const getUser = async () => {
  try {
    const userCode = localStorage.getItem('userCode')
    const authToken = localStorage.getItem('authToken')
    const response = await axios.post(
      'http://localhost:3000/store/getUser',
      { userCode: employeeCode.value },
      {
        timeout: 10000,
        withCredentials: true,
        headers: {
          userCode: userCode,
          Authorization: authToken,
        },
      },
    )
    employee.value = response.data.data
  } catch (error) {
    console.error('Error fetching data:', error)
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response
        ? error.response.data.message || 'Login failed'
        : error.request
          ? 'No response from server'
          : 'Error in login request'
      if (errorMessage.includes('User not Found')) {
        toast.error('User Not Found , Please enter valid UserCode ', {
          autoClose: 2000,
          position: 'bottom-right',
        })
      }
      const er = {
        success: false,
        errorMessage,
        details: error.response?.data,
      }
      console.error(er)
    }

    console.error({
      success: false,
      errorMessage: 'Unexpected error occurred',
      details: error,
    })
  }
}
onMounted(async () => {
  fetchData()
})
</script>
