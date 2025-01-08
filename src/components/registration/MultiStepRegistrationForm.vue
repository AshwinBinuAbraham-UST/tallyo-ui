<template>
  <div class="w-full">
    <div class="py-3"></div>
    <div v-if="step === 1">
      <IntialVerificationForm
        @next="
          (data: any) => {
            userData = data
            goToStep(2)
          }
        "
      />
    </div>
    <div v-if="step === 2">
      <RegistrationForm :initialData="userData" @next="goToStep(3)" />
    </div>
    <div v-if="step === 3">
      <CreateNewPassword :userData="userData" @next="goToStep(4)" />
    </div>

    <div class="flex w-full -mb-3 px-3 pt-5 justify-center">
      <a
        class="block text-sm underline text-indigo-700 fontme hover:underline"
        @click.prevent="$emit('show-login')"
        href="#"
      >
        Login
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import IntialVerificationForm from './IntialVerificationForm.vue'
import RegistrationForm from './RegistrationForm.vue'
import CreateNewPassword from './CreateNewPassword.vue'

interface UserData {
  userCode: string
  fullName: string
}

const step = ref(1)
const loading = ref(false)
const userData = ref<UserData | null>(null)
const goToStep = (stepNumber: number) => {
  loading.value = true
  step.value = stepNumber
}
</script>
