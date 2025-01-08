<template>
  <section class="flex flex-col md:flex-row w-full h-screen">
    <section class="md:w-2/4 bg-login-bg flex justify-center items-center text-4xl text-white">
      Tallyo Store
    </section>
    <section class="md:w-3/4">
      <div class="flex items-center justify-center px-6 h-screen bg-gray-200">
        <div class="w-full h-fit max-w-sm p-6 bg-white rounded-md shadow-md">
          <div class="flex items-center justify-center">
            <svg
              class="w-8 h-8 ml-2 text-amber-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              ></path>
            </svg>
            <span class="text-2xl font-semibold text-gray-700">Tallyo-Store</span>
          </div>

          <LoginForm
            v-if="currentForm === 'login'"
            @show-registration="currentForm = 'registration'"
            @show-forgot-password="
              (data: any) => {
                userCode = data
                currentForm = 'forgot-password'
              }
            "
          />
          <MultiStepRegistrationForm
            v-else-if="currentForm === 'registration'"
            @show-login="currentForm = 'login'"
          />
          <ForgotPasswordForm
            v-else-if="currentForm === 'forgot-password'"
            @show-login="currentForm = 'login'"
            :userCode="userCode"
          />
        </div>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import MultiStepRegistrationForm from '@/components/registration/MultiStepRegistrationForm.vue'
import LoginForm from '@/components/login/LoginForm.vue'
import ForgotPasswordForm from '@/components/login/ForgotPasswordForm.vue'
import { ref } from 'vue'
const currentForm = ref('login')
const userCode = ref('')
</script>
