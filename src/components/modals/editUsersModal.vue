<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-xl p-6 w-96">
      <h2 class="text-2xl font-bold mb-4">Edit User Details</h2>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="userName"> User Name </label>
        <div
          class="w-full shadow cursor-not-allowed appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          {{ formData.userName }}
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="phone"> Phone </label>
        <div
          class="w-full shadow cursor-not-allowed appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          +91 {{ formData.phone }}
        </div>
      </div>
      <div class="mb-4 flex flex-row justify-between">
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="accountStatus">
            Account Status
          </label>
          <select
            v-model="formData.accountStatus"
            class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option key="" value="active">Active</option>
            <option key="" value="inactive">InActive</option>
          </select>
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2"> Status </label>
          <select
            v-model="formData.status"
            class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="active" selected>Active</option>
            <option value="inactive">In-active</option>
            <option value="notice">Notice</option>
          </select>
        </div>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700  text-sm font-bold mb-2" > Mail </label>
        <a href="mailto:ashwinbinuabraham@gmail.com"
          class="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          {{ formData.email }}</a
        >
      </div>

      <div class="flex justify-between mt-6">
        <button
          @click="$emit('cancel')"
          class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel
        </button>
        <button
          @click="saveUserDetails"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { User } from '@/constants/types';
import { reactive } from 'vue'
import { onMounted } from 'vue'
const formData = reactive({
  userName: 'ash',
  phone: '918853283',
  accountStatus: 'active',
  status: 'active',
  email: 'ashwinbinu@gmaisl.com',
})
const props = defineProps<{
  selectedUser: User | null
}>()
// const emit = defineEmits<{
//   (e: 'cancel'): void
//   (e: 'save', updatedUser: Partial<User>): void
// }>()
onMounted(() => {
  formData.userName = props.selectedUser?.fullName || 'Ashwin'
  formData.phone = props.selectedUser?.employee?.phone || '9923454323'
  formData.status = 'active'
  formData.accountStatus = 'active'
  formData.email = props.selectedUser ? props.selectedUser?.email : 'ashwin@gmail.com'

})

const saveUserDetails = () => {
  // emit('save', formData)
}
</script>
