<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <AppBreadcrumb breadcrumb="Products" />
  <CustomLoader v-if="isLoading && TableData.length !== 0" />
  <div v-if="!isLoading || TableData.length == 0">
    <div class="mt-8">
      <div class="mt-6">
        <div class="flex flex-col mt-3 sm:flex-row">
          <div class="flex">
            <div class="relative">
              <select
                v-model="limit"
                @change="fetchData"
                class="block w-full h-full px-4 py-2 pr-8 leading-tight text-gray-700 bg-white border border-gray-400 rounded-l appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
              >
                <option>1</option>
                <option>5</option>
                <option>10</option>
                <option>20</option>
              </select>

              <div
                class="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none"
              >
                <svg
                  class="w-4 h-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                  />
                </svg>
              </div>
            </div>

            <div class="relative">
              <select
                v-model="category"
                @change="fetchData"
                class="block w-full h-full px-4 py-2 pr-8 leading-tight text-gray-700 bg-white border-t border-b border-r border-gray-400 rounded-r appearance-none sm:rounded-r-none sm:border-r-0 focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500"
              >
                <option value="">All Categories</option>
                <option v-for="(u, index) in CategoryData" :key="index">
                  {{ u.categoryName }}
                </option>
              </select>

              <div
                class="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none"
              >
                <svg
                  class="w-4 h-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div class="relative block mt-2 sm:mt-0">
            <span class="absolute inset-y-0 left-0 flex items-center pl-2">
              <svg viewBox="0 0 24 24" class="w-4 h-4 text-gray-500 fill-current">
                <path
                  d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"
                />
              </svg>
            </span>

            <input
              @change="fetchData"
              v-model="searchTerm"
              placeholder="Search"
              class="block w-full py-2 pl-8 pr-6 text-sm text-gray-700 placeholder-gray-400 bg-white border border-b border-gray-400 rounded-l rounded-r appearance-none sm:rounded-l-none focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
            />
          </div>
          <button
            @click="showAddProductsModal = true"
            class="relative block ml-4 h-full px-4 py-2 leading-tight text-gray-700 bg-white border border-gray-400 rounded-sm appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
          >
            Add New Product
          </button>
          <button
            @click="showAddCategoriesModal = true"
            class="relative block ml-4 h-full rounded-sm px-4 py-2 leading-tight text-gray-700 bg-white border border-gray-400 appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
          >
            Add Category
          </button>
          <button
            @click="updateProduct"
            class="relative block ml-4 h-full rounded-sm px-4 py-2 leading-tight text-gray-700 bg-white border border-gray-400 appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
          >
            Update Products
          </button>
        </div>

        <div class="px-4 py-4 -mx-4 overflow-x-hidden sm:-mx-8 sm:px-8">
          <div class="inline-block min-w-full overflow-hidden rounded-lg shadow">
            <table class="min-w-full">
              <thead>
                <tr>
                  <th
                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                  >
                    Product Code
                  </th>
                  <th
                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                  >
                    Name
                  </th>
                  <th
                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                  >
                    Category
                  </th>
                  <th
                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                  >
                    Cost
                  </th>
                  <th
                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                  >
                    Count
                  </th>
                  <th
                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                  >
                    Last Updated
                  </th>
                  <th
                    class="px-5 py-3 text-xs text-center font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                  >
                    Edit
                  </th>
                  <th
                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                  >
                    <button @click="sendNewsletter" class="bg-gray-300 p-1 text-center rounded">
                      Send Newsletter
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody class="">
                <tr
                  v-for="(u, index) in TableData"
                  :key="index"
                  :class="[
                    'border-b border-gray-200',
                    isUpdatedProduct(u)
                      ? 'bg-green-100 hover:bg-green-200'
                      : 'bg-white hover:bg-gray-100',
                    isNewsletterProduct(u)
                      ? 'bg-yellow-100 hover:bg-yellow-100'
                      : 'bg-white hover:bg-gray-100',
                  ]"
                >
                  <td class="px-5 py-5 text-sm border-b border-gray-200">
                    <div class="flex items-center w-14 text-wrap">
                      <div class="ml-3 flex flex-row">
                        <span v-if="isUpdatedProduct(u)" class="font-extrabold">* </span>
                        <p class="text-gray-900">
                          {{ u.productCode }}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td class="px-5 py-5 text-sm border-b border-gray-200">
                    <p class="text-gray-900 whitespace-nowrap">
                      {{
                        isUpdatedProduct(u)
                          ? updatedProducts.find((p) => p._id === u._id)?.productName ||
                            u.productName
                          : u.productName
                      }}
                    </p>
                  </td>
                  <td class="px-5 py-5 text-sm border-b border-gray-200">
                    <p class="text-gray-900 whitespace-nowrap">
                      {{ u.__category__.categoryName }}
                    </p>
                  </td>
                  <td class="px-5 py-5 text-sm border-b border-gray-200">
                    <span
                      :class="`relative inline-block bg-green-300 rounded-md px-3 py-1 font-semibold  leading-tight`"
                    >
                      <span aria-hidden :class="`absolute inset-0  opacity-50 rounded-full`"></span>
                      <span class="relative">
                        {{
                          isUpdatedProduct(u)
                            ? updatedProducts.find((p) => p._id === u._id)?.productCost ||
                              u.productCost
                            : u.productCost
                        }}</span
                      >
                    </span>
                  </td>
                  <td class="px-5 py-5 text-sm border-b border-gray-200">
                    <span
                      :class="`relative inline-block bg-blue-300 rounded-md px-3 py-1 font-semibold  leading-tight`"
                    >
                      <span aria-hidden :class="`absolute inset-0  opacity-50 rounded-full`"></span>
                      <span class="relative">
                        {{
                          isUpdatedProduct(u)
                            ? updatedProducts.find((p) => p._id === u._id)?.productCount ||
                              u.productCount
                            : u.productCount
                        }}</span
                      >
                    </span>
                  </td>
                  <td class="px-5 py-5 text-sm border-b border-gray-200">
                    <p class="text-gray-900 whitespace-nowrap">
                      {{ new Date(u.lastUpdated!).toLocaleString().split(',')[1] }}
                      <br />
                      {{ new Date(u.lastUpdated!).toLocaleString().split(',')[0] }}
                    </p>
                  </td>
                  <td class="px-5 py-5 text-sm border-b border-gray-200">
                    <div class="flex justify-around">
                      <span class="text-yellow-500 flex justify-center">
                        <button @click="selectProduct(u)" class="mx-2 px-2 rounded-md">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 text-green-700"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
                            />
                            <path
                              fill-rule="evenodd"
                              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </button>
                        <button
                          class="mx-2 px-2 rounded-md"
                          @click="deleteProduct(u._id, u.productName)"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 text-red-700"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </button>
                      </span>
                    </div>
                  </td>
                  <td class="px-5 py-5 text-sm border-b border-gray-200 text-center">
                    <button
                      v-if="!isNewsletterProduct(u)"
                      @click="addToNewsletter(u)"
                      class="bg-orange-300 w-6 h-6 text-center text-white rounded-full font-semibold"
                    >
                      +
                    </button>
                    <button
                      v-if="isNewsletterProduct(u)"
                      @click="addToNewsletter(u)"
                      class="bg-orange-300 w-6 h-6 text-center text-white rounded-full font-semibold"
                    >
                      -
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="TableData.length == 0" class="text-gray-400 text-center bg-white w-full">
              No Products found
            </div>
            <div
              class="flex flex-col items-center px-5 py-5 bg-white border-t xs:flex-row xs:justify-between"
            >
              <div class="inline-flex mt-2 xs:mt-0">
                <button
                  :disabled="page === 1"
                  @click="changePage(page - 1)"
                  class="px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed text-gray-800 bg-gray-300 rounded-l hover:bg-gray-400"
                >
                  Prev
                </button>
                <button
                  :disabled="page === totalPages"
                  @click="changePage(page + 1)"
                  class="px-4 py-2 text-sm disabled:cursor-not-allowed font-semibold text-gray-800 bg-gray-300 rounded-r hover:bg-gray-400"
                >
                  Next
                </button>
              </div>
              <span class="text-xs mt-2 text-gray-500 xs:text-sm"
                >{{ page }} out of {{ totalPages }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AddCategoryModal v-if="showAddCategoriesModal" @cancel="showAddCategoriesModal = false" />
    <AddProductsModal v-if="showAddProductsModal" @cancel="showAddProductsModal = false" />
    <EditProductModal
      v-if="showEditModal && selectedProduct"
      :selectedProduct="selectedProduct"
      @cancel="showEditModal = false"
      @save="
        (data: any) => {
          const existingIndex = updatedProducts.findIndex((product) => product._id === data._id)

          if (existingIndex !== -1) {
            updatedProducts.splice(existingIndex, 1, data)
          } else {
            updatedProducts.push(data)
          }
          showEditModal = false
        }
      "
    />
  </div>
</template>
<script lang="ts" setup>
import CustomLoader from '@/components/customLoader.vue'
import AddCategoryModal from '@/components/modals/addCategoryModal.vue'
import AddProductsModal from '@/components/modals/addProductsModal.vue'
import EditProductModal from '@/components/modals/editProductModal.vue'
import type { Category, Product } from '@/constants/types'
import AppBreadcrumb from '@/partials/AppBreadcrumb.vue'
import router from '@/router'
import axios from 'axios'
import { onMounted, ref, toRaw } from 'vue'
import { toast } from 'vue3-toastify'
const isUpdatedProduct = (product: Product) => {
  return updatedProducts.value.some((updatedProduct) => updatedProduct._id === product._id)
}
const isNewsletterProduct = (product: Product) => {
  return newsletterProduct.value.some((p) => p._id === product._id)
}
const isLoading = ref(true)
const updatedProducts = ref<Partial<Product>[]>([])
const selectProduct = (product: Product) => {
  selectedProduct.value = product
  showEditModal.value = true
}
const addToNewsletter = (product: Product) => {
  if (isNewsletterProduct(product)) {
    newsletterProduct.value = newsletterProduct.value.filter((p) => p._id !== product._id)
  } else newsletterProduct.value.push(product)
}
const showEditModal = ref(false)
const showAddProductsModal = ref(false)
const showAddCategoriesModal = ref(false)
const page = ref(1)
const limit = ref(5)
const totalPages = ref(1)
const selectedProduct = ref<Product | undefined>()
const newsletterProduct = ref<Product[]>([])
const changePage = (newPage: number) => {
  if (newPage > 0 && newPage <= totalPages.value) {
    page.value = newPage
    fetchData()
  }
}
const errorMessage = ref('')
const productIds = ref<{ _id: string }[]>([])
const deleteProduct = async (id: string, productName: string) => {
  try {
    const isConfirmed = window.confirm(`Are you sure you want to delete "${productName}"?`)
    if (!isConfirmed) {
      toast.info('Product deletion cancelled', {
        autoClose: 3000,
        position: 'bottom-right',
      })
      return
    }

    productIds.value.push({ _id: id })
    const userCode = localStorage.getItem('userCode')
    const authToken = localStorage.getItem('authToken')
    const response = await axios.delete('http://localhost:3000/store/removeProduct', {
      data: productIds.value,
      headers: {
        userCode: userCode,
        Authorization: authToken,
      },
      timeout: 10000,
      withCredentials: true,
    })
    if (response.status == 200) {
      toast.success(`${productName} deleted successfully`, {
        autoClose: 3000,
        position: 'bottom-right',
      })
    }
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
    console.error('Error deleting product :', errorMessage.value)
  }
}
const CategoryData = ref<Category[]>([])
const TableData = ref<Product[]>([])
const searchTerm = ref('')
const category = ref('')
const fetchData = async () => {
  try {
    const userCode = localStorage.getItem('userCode')
    const authToken = localStorage.getItem('authToken')
    const response = await axios.get(`http://localhost:3000/store/viewMenu`, {
      timeout: 10000,
      withCredentials: true,
      headers: {
        userCode: userCode,
        Authorization: authToken,
      },
      params: {
        page: page.value,
        limit: limit.value,
        searchTerm: searchTerm.value,
        category: category.value,
      },
    })
    TableData.value = response.data.data.products
    totalPages.value = response.data.data.totalPages
    isLoading.value = false
  } catch (error) {
    TableData.value = []
    totalPages.value = 0
    console.error('Error fetching data:', error)
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

const fetchCategories = async () => {
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
    })
    CategoryData.value = response.data.data
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

    if (errorMessage.value == 'Login failed') {
      alert(errorMessage)
      router.push('/')
    }
  }
}
const sendNewsletter = async () => {
  try {
    const userCode = localStorage.getItem('userCode')
    const authtoken = localStorage.getItem('authToken')
    const response = await axios.post(
      `http://localhost:3000/store/addNewsletter`,
      newsletterProduct.value,
      {
        timeout: 10000,
        withCredentials: true,
        headers: {
          userCode: userCode,
          Authorization: authtoken,
        },
      },
    )
    newsletterProduct.value = []
    if (response.status == 200) {
      toast('Newsletter Send Successfully', {
        autoClose: 3000,
        type: 'success',
        position: 'bottom-right',
        transition: 'bounce',
      })
    }
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
    console.error('Error sending data :', errorMessage.value)
  }
}
const updateProduct = async () => {
  try {
    const userCode = localStorage.getItem('userCode')
    const authtoken = localStorage.getItem('authToken')
    const cleanProducts = toRaw(updatedProducts.value)
    const response = await axios.post(`http://localhost:3000/store/updateProduct`, cleanProducts, {
      timeout: 10000,
      withCredentials: true,
      headers: {
        userCode: userCode,
        Authorization: authtoken,
      },
    })
    updatedProducts.value = []
    fetchData()
    if(response.status==200)
    toast('Products Updated Successfully', {
      autoClose: 3000,
      type: 'success',
      position: 'bottom-right',
      transition: 'bounce',
    })
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
    console.error('Error on updating product :', errorMessage.value)
  }
}
onMounted(async () => {
  fetchCategories()
  fetchData()
})
</script>
