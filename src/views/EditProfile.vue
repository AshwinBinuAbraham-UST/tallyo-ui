<template>
  <CustomLoader v-if="!storeUser" />
  <div v-if="storeUser">
  <section>
    <div class="w-full relative group">
      <div
        :style="{
          background: `linear-gradient(rgba(0, 0, 0, 0.1),rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.8)), url(${coverImagePreview || userData.__store__.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }"
        class=" rounded-b-none rounded-t-3xl w-full h-48 object-cover"
      ></div>

      <label
        for="coverImage"
        class="absolute right-5 bottom-3 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded cursor-pointer text-white flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
          />
        </svg>
        Edit Cover
      </label>
      <input
        id="coverImage"
        type="file"
        accept="image/*"
        @change="handleCoverImageUpload"
        class="hidden"
      />

      <div class="absolute left-20 top-24 group/logo">
        <img
          class="rounded-full z-10 w-36 h-36 object-cover bg-white border-2 border-gray-600"
          :src="logoImagePreview || userData.__store__.logoUrl!"
        />
        <label
          for="logoImage"
          class="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity cursor-pointer"
        >
          <span class="text-white flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"
              />
              <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
            </svg>
            <span class="text-sm">Upload Logo</span>
          </span>
        </label>
        <input
          id="logoImage"
          type="file"
          accept="image/*"
          @change="handleLogoImageUpload"
          class="hidden"
        />
      </div>

      <div
        class="absolute text-5xl text-left left-[240px] top-36  text-white text-ellipsis drop-shadow-md font-semibold shadow-black"
      >
        {{ userData.fullName }}
      </div>
    </div>
    <div class="w-full flex flex-row">
      <div class="bg-white mt-3 rounded-md mr-1 w-2/6"></div>
      <form class="w-full mt-3 shadow-md bg-white rounded-md p-3" @submit.prevent="updateProfile">
        <div class="">
          <div class="flex items-center justify-end"></div>
          <div class="flex flex-col w-2/3">
            <div class="mb-3 flex flex-col">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="productCost">
                Store Type
              </label>
              <input
                id="transactionCode"
                v-model="storeType"
                type="text"
                class="uppercase shadow appearance-none border rounded py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div class="flex flex-col">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="productCost">
                Store Location
              </label>
              <input
                id="storeLocation"
                v-model="storeLocation"
                type="text"
                class="uppercase shadow appearance-none border rounded py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
          </div>

          <div class="flex flex-row gap-3">
            <div class="mb-3 flex flex-col w-2/3">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="productCost">
                Phone Number
              </label>
              <input
                id="transactionCode"
                v-model="phone"
                type="text"
                class="uppercase shadow appearance-none border rounded py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <button
              type="submit"
              class="bg-gray-500 hover:bg-blue-700 mt-6 ml-10 text-white font-bold px-4 py-1 h-fit rounded focus:outline-none focus:shadow-outline"
            >
              Reset
            </button>
            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-700 mt-6 text-white font-bold px-4 h-fit py-1 rounded focus:outline-none focus:shadow-outline"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  </section>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { useStoreInfo } from '@/stores/store'
import { toast } from 'vue3-toastify'
import axios from 'axios'
import CustomLoader from '@/components/customLoader.vue'
import type { User } from '@/constants/types'

const storeUser = useStoreInfo()
const userData:User = storeUser.userData!
const coverImagePreview = ref('')
const logoImagePreview = ref('')
const coverImage = ref<File | null>(null)
const logoImage = ref<File | null>(null)
const storeType = ref(userData.__store__.storeType)
const storeLocation = ref(userData.__store__.storeLocation)
const phone = ref(userData.__store__.phone)
const errorMessage = ref('')

const handleCoverImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    coverImage.value = file
    coverImagePreview.value = URL.createObjectURL(file)
  }
}

const handleLogoImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    logoImage.value = file
    logoImagePreview.value = URL.createObjectURL(file)
  }
}
const updateProfile = async () => {
  try {
    const formData = new FormData()
    if (coverImage.value) formData.append('coverImage', coverImage.value)
    if (logoImage.value) formData.append('logoImage', logoImage.value)
    formData.append('storeType', storeType.value)
    formData.append('storeLocation', storeLocation.value)
    formData.append('phone', phone.value)

    const userCode = localStorage.getItem('userCode')
    const authToken = localStorage.getItem('authToken')
    const response = await axios.post('http://localhost:3000/store/editProfile', formData, {
      timeout: 10000,
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
        userCode: userCode,
        Authorization: authToken,
      },
    })
    if (response.status == 200) {
      toast.success(response.data.message, {
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
    console.error('Profile Updation Failed :', errorMessage.value)

  }
}
onUnmounted(() => {
  if (coverImagePreview.value) URL.revokeObjectURL(coverImagePreview.value)
  if (logoImagePreview.value) URL.revokeObjectURL(logoImagePreview.value)
})
</script>
