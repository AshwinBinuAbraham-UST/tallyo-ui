<template>
  <div class="bg-white rounded-lg shadow-md p-5 mt-5">
    <div class="mb-5 flex justify-between items-center">
      <h2 class="text-2xl font-medium text-gray-800 m-0">Product Sales Distribution</h2>
      <div class="flex gap-2.5">
        <button
          v-for="period in timePeriods"
          :key="period.value"
          :class="[
            'px-4 py-2 border rounded-md transition-all duration-200 cursor-pointer',
            selectedPeriod === period.value
              ? 'bg-indigo-500 text-white border-indigo-500'
              : 'bg-white border-gray-200 hover:bg-gray-50'
          ]"
          @click="selectedPeriod = period.value"
        >
          {{ period.label }}
        </button>
      </div>
    </div>

    <!-- Date Selection Controls -->
    <div class="mb-5 flex justify-center gap-4">
      <input
        v-if="selectedPeriod === 'daily'"
        type="date"
        v-model="selectedDate"
        :max="maxDate"
        class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div v-if="selectedPeriod === 'weekly'" class="flex gap-4">
        <input
          type="date"
          v-model="weekStart"
          :max="maxDate"
          class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <span class="self-center">to</span>
        <input
          type="date"
          v-model="weekEnd"
          :max="maxDate"
          class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div v-if="selectedPeriod === 'monthly'" class="flex gap-4">
        <select
          v-model="selectedMonth"
          class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option v-for="month in availableMonths" :key="month.value" :value="month.value">
            {{ month.label }}
          </option>
        </select>
      </div>
    </div>

    <div class="relative min-h-[400px]">
      <v-chart class="h-[400px] w-full" :option="chartOption" autoresize />
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div class="text-gray-600 text-sm">Total Sales: ₹{{ totalSales }}</div>
        <div class="text-gray-600 text-sm">Total Items: {{ totalItems }}</div>
        <div class="mt-2 font-medium text-gray-600">{{ periodDisplay }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'

use([PieChart, TitleComponent, TooltipComponent, LegendComponent, CanvasRenderer])

interface SaleData {
  productid: string
  productname: string
  date: string
  totalsold: string
  totalcost: string
}

const props = defineProps<{
  salesData: SaleData[]
}>()

const timePeriods = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
]

const selectedPeriod = ref('daily')
const selectedDate = ref(new Date().toISOString().split('T')[0])
const weekStart = ref(new Date().toISOString().split('T')[0])
const weekEnd = ref(new Date().toISOString().split('T')[0])
const selectedMonth = ref('')

// Calculate available months from data
const availableMonths = computed(() => {
  const months = new Set()
  props.salesData.forEach(sale => {
    const date = new Date(sale.date)
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    months.add(monthYear)
  })

  return Array.from(months).map(monthYear => ({
    value: monthYear,
    label: new Date(`${monthYear}-01`).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long'
    })
  })).sort().reverse()
})

// Set initial month selection
onMounted(() => {
  if (availableMonths.value.length > 0) {
    selectedMonth.value = availableMonths.value[0].value
  }
})

// Update week end date when start date changes
watch(weekStart, (newValue) => {
  const endDate = new Date(newValue)
  endDate.setDate(endDate.getDate() + 6)
  weekEnd.value = endDate.toISOString().split('T')[0]
})

const periodDisplay = computed(() => {
  switch (selectedPeriod.value) {
    case 'daily':
      return `Date: ${new Date(selectedDate.value).toLocaleDateString()}`
    case 'weekly':
      return `Period: ${new Date(weekStart.value).toLocaleDateString()} - ${new Date(weekEnd.value).toLocaleDateString()}`
    case 'monthly':
      if (selectedMonth.value) {
        return `Month: ${new Date(selectedMonth.value + '-01').toLocaleDateString(undefined, {
          month: 'long',
          year: 'numeric'
        })}`
      }
      return ''
    default:
      return ''
  }
})

const processedData = computed(() => {
  const filteredData = props.salesData.filter((sale) => {
    const saleDate = new Date(sale.date)
    saleDate.setHours(0, 0, 0, 0)

    switch (selectedPeriod.value) {
      case 'daily': {
        const compareDate = new Date(selectedDate.value)
        compareDate.setHours(0, 0, 0, 0)
        return saleDate.getTime() === compareDate.getTime()
      }
      case 'weekly': {
        const start = new Date(weekStart.value)
        const end = new Date(weekEnd.value)
        return saleDate >= start && saleDate <= end
      }
      case 'monthly': {
        if (!selectedMonth.value) return false
        const [year, month] = selectedMonth.value.split('-')
        return (
          saleDate.getMonth() + 1 === parseInt(month) &&
          saleDate.getFullYear() === parseInt(year)
        )
      }
      default:
        return true
    }
  })

  // Group by product
  const productSales = filteredData.reduce(
    (acc, sale) => {
      if (!acc[sale.productname]) {
        acc[sale.productname] = {
          value: 0,
          quantity: 0,
          name: sale.productname,
        }
      }
      acc[sale.productname].value += Number(sale.totalcost)
      acc[sale.productname].quantity += Number(sale.totalsold)
      return acc
    },
    {} as Record<string, { value: number; quantity: number; name: string }>,
  )

  return Object.values(productSales)
})

const totalSales = computed(() => {
  return processedData.value.reduce((sum, item) => sum + item.value, 0).toLocaleString()
})

const totalItems = computed(() => {
  return processedData.value.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()
})

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: (params: any) => {
      const data = processedData.value.find((item) => item.name === params.name)
      return `${params.name}<br/>
              Sales: ₹${params.value.toLocaleString()} (${params.percent}%)<br/>
              Quantity: ${data?.quantity || 0} items`
    },
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    type: 'scroll',
  },
  series: [
    {
      name: 'Product Sales',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: true,
        formatter: '{b}: {d}%',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold',
        },
      },
      data: processedData.value,
    },
  ],
}))
</script>

<style scoped>
.sales-distribution-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 20px;
}

.card-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.view-controls {
  display: flex;
  gap: 10px;
}

.view-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn.active {
  background: #8884d8;
  color: white;
  border-color: #8884d8;
}

.date-controls {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.date-controls input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.chart-container {
  position: relative;
  min-height: 400px;
}

.chart {
  height: 400px;
  width: 100%;
}

.total-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: 0.9rem;
  color: #666;
}

.period-info {
  margin-top: 8px;
  font-weight: 500;
}

.no-data {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #666;
  font-size: 1.1rem;
}
</style>
