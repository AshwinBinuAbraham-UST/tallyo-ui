

<template>
  <div class="card">
    <div class="bg-white rounded-lg shadow-md p-5">
    <h3 class="text-lg font-semibold mb-4">User Login Frequency (24-Hour)</h3>
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

interface loginData{
  userCode: string
  lastLogin: string
  fullName:string
}
const props = defineProps<{
  LoginData: loginData[]
}>()
const processData = (data: loginData[]) => {
  const sortedData = [...data].sort((a, b) =>
    new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime()
  )

  const timePoints = sortedData.map(login => {
    const date = new Date(login.lastLogin)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`

    return {
      time: timeString,
      timestamp: date.getTime(),
      fullName: login.fullName
    }
  })

  const loginCounts = timePoints.reduce((acc, curr) => {
    const key = curr.time
    if (!acc[key]) {
      acc[key] = {
        count: 0,
        users: []
      }
    }
    acc[key].count++
    acc[key].users.push(curr.fullName)
    return acc
  }, {} as Record<string, { count: number, users: string[] }>)

  // Convert to arrays for ECharts
  const times = Object.keys(loginCounts)
  const counts = times.map(time => loginCounts[time].count)
  const userDetails = times.map(time => loginCounts[time].users)

  return { times, counts, userDetails }
}

const chartOption = computed(() => {
  const { times, counts, userDetails } = processData(props.LoginData)

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      formatter: function(params: any) {
        const index = params[0].dataIndex
        const users = userDetails[index].join(', ')
        return `Time: ${times[index]}<br/>
                Logins: ${counts[index]}<br/>
                Users: ${users}`
      }
    },
    legend: {
      data: ['Bar', 'Line'],
      top: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: times,
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      minInterval: 1
    },
    series: [
      {
        name: 'Bar',
        type: 'bar',
        data: counts,
        itemStyle: {
          color: '#93c5fd'
        },
        barWidth: '60%',
        emphasis: {
          itemStyle: {
            color: '#60a5fa'
          }
        }
      },
      {
        name: 'Line',
        type: 'line',
        smooth: true,
        data: counts,
        itemStyle: {
          color: '#2563eb'
        },
        lineStyle: {
          width: 3
        },
        symbolSize: 8
      }
    ]
  }
})
</script>
