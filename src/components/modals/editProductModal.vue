<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-xl p-6 w-96">
      <h2 class="text-2xl font-bold mb-4">Edit Product Details</h2>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="productName">
          Product Name
        </label>
        <input
          id="productName"
          v-model="productName"
          type="text"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="productCost">
          Product Cost
        </label>
        <input
          id="productCost"
          v-model.number="productCost"
          type="number"
          min="0"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2"> Product Count </label>
        <div class="flex items-center">
          <button
            @click="decrementCount"
            class="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-l hover:bg-gray-300"
          >
            -
          </button>
          <input
            v-model.number="productCount"
            type="number"
            min="0"
            class="w-20 text-center border-t border-b py-2 px-3"
          />
          <button
            @click="incrementCount"
            class="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-r hover:bg-gray-300"
          >
            +
          </button>
        </div>
      </div>

      <div class="flex justify-between mt-6">
        <button
          @click="$emit('cancel')"
          class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel
        </button>
        <button
          @click="saveProductDetails"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Product } from '@/constants/types';
import { ref, onMounted } from 'vue'

const props = defineProps < {
  selectedProduct:Product | null
}>()


const productName = ref('')
const productCost = ref(0)
const productCount = ref(0)


const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'save',updatedProduct:Partial<Product>): void
}>()
onMounted(() => {
  productName.value = props.selectedProduct?.productName || ''
  productCost.value = props.selectedProduct?.productCost || 0
  productCount.value = props.selectedProduct?.productCount || 0
})

const incrementCount = () => {
  productCount.value += 1
}

const decrementCount = () => {
  if (productCount.value > 0) {
    productCount.value -= 1
  }
}

// Save method
const saveProductDetails = () => {
  const updatedProduct: Partial<Product> = {
    _id: props.selectedProduct?._id,
    productCode:props.selectedProduct?.productCode,
    productName: productName.value,
    productCost: productCost.value,
    productCount: productCount.value
  }

  emit('save', updatedProduct)
}
</script>
