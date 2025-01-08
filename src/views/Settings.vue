<template>
  <!-- <CustomLoader v-if="!storeUse" /> -->

    <div class="w-full flex flex-row">

      <div class="bg-white mt-3 rounded-md mr-1 w-2/6"></div>
      <div class="w-full mt-3 shadow-md bg-white rounded-md p-3" @submit.prevent="">
         <button
          class='py-2 px-8  rounded-md bg-primary text-typography m-2'
          @click="changeTheme('')">
          Default
        </button>
        <button
          class='py-2 px-8  rounded-md bg-primary text-typography m-2'
          @click="changeTheme('tech')">
          tech
        </button>
        <button
          class='py-2 px-8  rounded-md bg-primary text-typography m-2'
          @click="changeTheme('ocean')">
          ocean
        </button>
        <button
          class='py-2 px-8  rounded-md bg-primary text-typography m-2'
          @click="changeTheme('sunset')">
          sunset
        </button>
        <button
          class='py-2 px-8  rounded-md bg-primary text-typography m-2'
          @click="changeTheme('forest')">
          forest
        </button>
        <button
          class='py-2 px-8  rounded-md bg-primary text-typography m-2'
          @click="changeTheme('night')">
          night
        </button>
        <button
          class='py-2 px-8 bg-primary text-typography m-2'
          @click="changeTheme('uno')"
          >
          Theme Uno
        </button>
        <button
          class='py-2 px-8 bg-primary text-typography m-2'
          @click="changeTheme('dos')">
          Theme Dos
        </button>
        <div class="">
          <div class="flex items-center justify-end"></div>
          <div class="flex flex-col w-2/3">
            <div class="mb-3 flex flex-wrap">

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
      </div>
    </div>

</template>

<script setup lang="ts">
import { changeTheme } from '@/utils/helper'
import { onUnmounted, ref } from 'vue'
import { useStoreInfo } from '@/stores/store'
import { toast } from 'vue3-toastify'
import axios from 'axios'
import CustomLoader from '@/components/customLoader.vue'

</script>
