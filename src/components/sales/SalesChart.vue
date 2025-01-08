<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<template>
  <div class="bg-white rounded-lg shadow-md p-5">
    <div class="mb-5 flex justify-between items-center">
      <h2 class="text-2xl font-medium text-gray-800 m-0">Sales Overview</h2>
      <div class="flex gap-2.5">
        <button
          v-for="view in viewOptions"
          :key="view.value"
          :class="[
            'px-4 py-2 border rounded-md transition-all duration-200 cursor-pointer',
            currentView === view.value
              ? 'bg-indigo-500 text-white border-indigo-500'
              : 'bg-white border-gray-200 hover:bg-gray-50'
          ]"
          @click="currentView = view.value"
        >
          {{ view.label }}
        </button>
      </div>
    </div>
    <div>
      <div class="text-center text-gray-500 text-sm mb-2.5">
        Tip: Use mouse wheel to zoom, drag slider to scroll, or click and drag chart area
      </div>
      <v-chart class="h-[400px] w-full" :option="chartOption" autoresize />
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
  ToolboxComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'

use([
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  ToolboxComponent,
  CanvasRenderer
])

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
const viewOptions = [
  { label: 'Daily View', value: 'daily' },
  { label: 'Monthly View', value: 'monthly' }
]
const currentView = ref('monthly')
const processedData = computed(() => {
  const dailyData = props.salesData.reduce((acc, sale) => {
    const date = new Date(sale.date)
    const dateKey = date.toISOString().split('T')[0]
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    if (!acc.daily[dateKey]) {
      acc.daily[dateKey] = {
        date: dateKey,
        totalSales: 0,
        totalQuantity: 0
      }
    }
    acc.daily[dateKey].totalSales += Number(sale.totalcost)
    acc.daily[dateKey].totalQuantity += Number(sale.totalsold)

    if (!acc.monthly[monthKey]) {
      acc.monthly[monthKey] = {
        date: monthKey,
        totalSales: 0,
        totalQuantity: 0
      }
    }
    acc.monthly[monthKey].totalSales += Number(sale.totalcost)
    acc.monthly[monthKey].totalQuantity += Number(sale.totalsold)

    return acc
  }, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    daily: {} as Record<string, any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    monthly: {} as Record<string, any>
  })

  return {
    daily: Object.values(dailyData.daily)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    monthly: Object.values(dailyData.monthly)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }
})


const chartOption = computed(() => {
  const data = currentView.value === 'daily'
    ? processedData.value.daily
    : processedData.value.monthly

  return {
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none',
          title: {
            zoom: 'Area Zoom',
            back: 'Restore Zoom'
          }
        },
        restore: {
          title: 'Reset'
        }
      },
      right: 30
    },
    tooltip: {
      trigger: 'axis',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: (params: any[]) => {
        const date = currentView.value === 'daily'
          ? new Date(params[0].name).toLocaleDateString()
          : new Date(params[0].name + '-01').toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
        let result = `<strong>${date}</strong><br/>`
        params.forEach(param => {
          result += `${param.seriesName}: ${param.value}<br/>`
        })
        return result
      }
    },
    legend: {
      data: ['Sales Amount', 'Items Sold']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '20%', // Increased to accommodate zoom slider
      containLabel: true
    },
    dataZoom: [
      {
        type: 'slider',
        show: true,
        start: 0,
        end: currentView.value === 'daily' ? 30 : 100, 
        bottom: 5,
        height: 30,
        borderColor: '#ccc',
        textStyle: {
          color: '#666'
        },
        handleSize: '110%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      },
      {
        type: 'inside', // Enable mouse wheel zoom
        start: 0,
        end: currentView.value === 'daily' ? 30 : 100,
        zoomOnMouseWheel: 'shift', // Require holding shift key to zoom with mouse wheel
        moveOnMouseMove: true // Enable drag to move
      }
    ],
    xAxis: {
      type: 'category',
      data: data.map(item => item.date),
      axisLabel: {
        formatter: (value: string) => {
          return currentView.value === 'daily'
            ? new Date(value).toLocaleDateString()
            : new Date(value + '-01').toLocaleDateString(undefined, { year: 'numeric', month: 'short' })
        },
        interval: currentView.value === 'daily' ? 'auto' : 0
      }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Sales Amount',
        position: 'left'
      },
      {
        type: 'value',
        name: 'Items Sold',
        position: 'right'
      }
    ],
    series: [
      {
        name: 'Sales Amount',
        type: currentView.value === 'monthly' ? 'bar' : 'line',
        data: data.map(item => item.totalSales),
        smooth: true,
        itemStyle: {
          color: '#8884d8'
        }
      },
      {
        name: 'Items Sold',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(item => item.totalQuantity),
        smooth: true,
        itemStyle: {
          color: '#82ca9d'
        }
      }
    ]
  }
})
</script>
