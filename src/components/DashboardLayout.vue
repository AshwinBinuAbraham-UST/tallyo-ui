<template>
<div v-if="isLoading" class="">
 <svg class="animate-spin h-5 w-5 mr-3 " viewBox="0 0 24 24">
  </svg></div>
<div v-if="!isLoading">
  <div class="flex h-screen bg-gray-200 font-roboto">
    <Sidebar :user />

    <div class="flex-1 flex flex-col overflow-hidden">
      <Header :user />

      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
        <div class="container h-full mx-auto px-6 py-8">
          <slot />
        </div>
      </main>
      <Footer />
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import Sidebar from './AppSidebar.vue'
import Header from './AppHeader.vue'
import Footer from './AppFooter.vue'
import {  onMounted, ref } from 'vue'
import router from '@/router'
import { useAuthStore } from '@/stores/login'
import { useStoreInfo } from '@/stores/store'
import { type User } from '@/constants/types'
const user =ref<User>()
const userStore = useStoreInfo()
const authStore = useAuthStore()
const isLoading = ref(true)
const fetchUserStore = async () => {
  try {
    const userCode = localStorage.getItem('userCode')
    const authToken = localStorage.getItem('authToken')
    // console.log(userCode, authToken)
    const response = await axios.get('http://localhost:3000/store/me', {
      withCredentials: true,
      headers: {
        userCode: userCode,
        Authorization: authToken,
      },
    })
    userStore.userData = response.data.data
    user.value = userStore.userData
    isLoading.value= false
  } catch (error) {
    console.error('Error fetching store:', error)
    console.log(authStore.isAuthenticated)
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

onMounted(async () => {
  fetchUserStore()
})
</script>
