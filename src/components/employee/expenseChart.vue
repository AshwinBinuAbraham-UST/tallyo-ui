<template>
  <div class="bg-white rounded-lg shadow-md p-5">
    <div class="mb-4 flex gap-4 items-center">
      <select v-model="selectedView" class="p-2 border rounded">
        <option value="store">View by Store</option>
        <option value="product">View by Product</option>
      </select>

      <select v-model="timeFrame" class="p-2 border rounded">
        <option value="daily">Daily View</option>
        <option value="monthly">Monthly View</option>
      </select>
    </div>



    <v-chart class="h-[400px] w-full" :option="chartOption" autoresize />
    <div class="mb-4 bg-gray-50 p-4 rounded">
      <div class="text-md font-semibold">Summary</div>
      <div class="grid grid-cols-2 gap-4 mt-2">
        <div class="bg-lime-200 w-fit rounded-sm px-2 py-1">
          <span class="font-medium">Total Expenses:</span>
          ₹{{ totalExpenses.toLocaleString() }}
        </div>
        <div class="bg-sky-200 w-fit rounded-sm px-2 py-1">
          <span class="font-medium"
            >Average {{ timeFrame === 'daily' ? 'Daily' : 'Monthly' }} Expense:</span
          >
          ₹{{ averageExpense.toLocaleString() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { use } from 'echarts/core'
import { LineChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  ToolboxComponent,
} from 'echarts/components'
export interface ExpenseData {
  productid: string
  productname: string
  date: string
  storename: string
  storecode: string
  totalsold: string
  totalcost: string
}

export type TimeFrame = 'daily' | 'monthly'
export type ViewType = 'store' | 'product'

interface ProcessedExpenseData extends Omit<ExpenseData, 'date' | 'totalcost' | 'totalsold'> {
  date: Date
  totalcost: number
  totalsold: number
}

interface GroupedData {
  [key: string]: ProcessedExpenseData[]
}

interface ProcessedDataResult {
  groupedData: GroupedData
  timeKeys: string[]
}
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'

use([
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  ToolboxComponent,
  CanvasRenderer,
])

const props = defineProps<{
  expenseData: ExpenseData[]
}>()

const selectedView = ref<ViewType>('store')
const timeFrame = ref<TimeFrame>('daily')

const processedData = computed<ProcessedDataResult>(() => {
  const data = props.expenseData
    .map((item) => ({
      ...item,
      date: new Date(item.date),
      totalcost: parseFloat(item.totalcost),
      totalsold: parseInt(item.totalsold),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  if (timeFrame.value === 'monthly') {
    const monthlyData = data.reduce(
      (acc, item) => {
        const monthKey = `${item.date.getFullYear()}-${(item.date.getMonth() + 1).toString().padStart(2, '0')}`
        if (!acc[monthKey]) {
          acc[monthKey] = []
        }
        acc[monthKey].push(item)
        return acc
      },
      {} as Record<string, typeof data>,
    )

    return { groupedData: monthlyData, timeKeys: Object.keys(monthlyData).sort() }
  } else {
    const dailyData = data.reduce(
      (acc, item) => {
        const dateKey = item.date.toISOString().split('T')[0]
        if (!acc[dateKey]) {
          acc[dateKey] = []
        }
        acc[dateKey].push(item)
        return acc
      },
      {} as Record<string, typeof data>,
    )

    return { groupedData: dailyData, timeKeys: Object.keys(dailyData).sort() }
  }
})

const totalExpenses = computed(() => {
  return props.expenseData.reduce((sum, item) => sum + parseFloat(item.totalcost), 0)
})

const averageExpense = computed(() => {
  const uniqueTimePoints = Object.keys(processedData.value.groupedData).length
  return uniqueTimePoints ? totalExpenses.value / uniqueTimePoints : 0
})

const chartOption = computed<EChartsOption>( () => {
  const { groupedData, timeKeys } = processedData.value
  const groupBy = selectedView.value === 'store' ? 'storename' : 'productname'
  const uniqueGroups = [...new Set(props.expenseData.map((item) => item[groupBy]))]

  const series = uniqueGroups.map((name, index) => {
    const data = timeKeys.map((timeKey) => {
      const entries = groupedData[timeKey].filter((item) => item[groupBy] === name)
      const totalCost = entries.reduce((sum, item) => sum + item.totalcost, 0)

      return {
        value: totalCost,

        data: entries,
      }
    })

    return {
      name,
      type: 'bar',
      stack: 'total',
      data,

    }
  })

  return {
    title: {
      text: `${timeFrame.value === 'daily' ? 'Daily' : 'Monthly'} Expenses : ${
        selectedView.value === 'store' ? 'Store Wise' : 'Product Wise'
      }`,
      left: 'center',
      textStyle: {
        fontSize:'20px'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function (params: any[]) {
        const timePoint = params[0].axisValue
        const total = params.reduce((sum, param) => sum + (param.value || 0), 0)

        let tooltip = `<div>
          <strong>${
            timeFrame.value === 'daily'
              ? new Date(timePoint).toLocaleDateString()
              : timePoint.replace('-', ' ')
          }</strong>
          <br/>Total: ₹${total.toLocaleString()}
        </div>`

        params.forEach((param) => {
          if (param.value > 0) {
            tooltip += `
              <div style="margin-top: 5px;">
                <span style="display: inline-block; width: 10px; height: 10px;
                      background-color: ${param.color};"></span>
                <strong>${param.seriesName}</strong>: ₹${param.value.toLocaleString()}<br/>
                ${
                  selectedView.value === 'product'
                    ? `Total Quantity: ${param.data.data.reduce(
                        (sum: number, item: ProcessedExpenseData) => sum + item.totalsold,
                        0,
                      )}`
                    : ''
                }
              </div>
              `
          }
        })
        return tooltip
      },
    },
    legend: {
      data: uniqueGroups,
      top: 30,
      width: 550,
      itemHeight: 5,
      itemWidth: 10,
      textStyle: {
        fontSize:'8px'
      },
      borderWidth: 0.08,
      borderRadius:25,
      borderColor: '#000000',


    },
    toolbox: {
      feature: {
        dataZoom: { yAxisIndex: 'none' },
        restore: {},
        saveAsImage: {},
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: timeKeys.map((key) =>
        timeFrame.value === 'daily' ? new Date(key).toLocaleDateString() : key.replace('-', ' '),
      ),
      axisLabel: { rotate: 45 },
    },
    yAxis: {
      type: 'value',
      name: 'Amount (₹)',
    },
    series,
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
      },
      {
        start: 0,
        end: 100,
      },
    ],
  }
})
</script>
