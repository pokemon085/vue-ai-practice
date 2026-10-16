<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import * as echarts from 'echarts/core'
import { BarChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption, EChartsType } from 'echarts'

/**
 * ECharts 的最小封裝。
 * 不引入 vue-echarts，避免為了兩張圖表多裝一個套件；
 * 只負責 init / setOption / resize / dispose 這四件事。
 */
const props = withDefaults(
  defineProps<{
    option: EChartsOption
    /** 圖表高度（設計稿的圖表為固定高度區塊，寬度則跟著容器） */
    height?: number
  }>(),
  { height: 260 },
)

// 只註冊實際用到的圖表型別與元件，避免把整包 echarts 打進 bundle。
echarts.use([BarChart, PieChart, GridComponent, TooltipComponent, CanvasRenderer])

const containerRef = ref<HTMLDivElement | null>(null)
const chart = shallowRef<EChartsType | null>(null)
let resizeObserver: ResizeObserver | null = null

const render = () => {
  // notMerge = true：圖表資料為整份替換，不做舊資料的合併
  chart.value?.setOption(props.option, true)
}

onMounted(() => {
  if (!containerRef.value) return

  chart.value = echarts.init(containerRef.value)
  render()

  // 圖表寬度應跟著「容器」變化而非視窗（例如 Sidebar 收合時容器變寬），
  // 因此使用 ResizeObserver 而不是 window resize 事件。
  resizeObserver = new ResizeObserver(() => chart.value?.resize())
  resizeObserver.observe(containerRef.value)
})

watch(() => props.option, render, { deep: true })

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
  chart.value?.dispose()
  chart.value = null
})
</script>

<template>
  <div ref="containerRef" class="base-chart" :style="{ height: `${props.height}px` }" />
</template>

<style scoped lang="scss">
.base-chart {
  width: 100%;
}
</style>
