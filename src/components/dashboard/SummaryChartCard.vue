<script setup lang="ts">
import { computed } from 'vue'
import type { EChartsOption } from 'echarts'
import BaseChart from '@/components/charts/BaseChart.vue'
import { summaryBarChart } from '@/data/dashboard'

/**
 * 「Summary」長條圖卡片。
 * 設計稿的 y 軸刻度為 100k ～ 20k（不含 0），x 軸為 Sept 10 ～ 16。
 */
const option = computed<EChartsOption>(() => ({
  grid: { left: 0, right: 0, top: 8, bottom: 0, containLabel: true },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
  },
  xAxis: {
    type: 'category',
    data: summaryBarChart.data.map((item) => item.label),
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: '#bec0ca', // Black/10
      fontSize: 11,
      fontFamily: 'Inter, sans-serif',
    },
  },
  yAxis: {
    type: 'value',
    max: summaryBarChart.max,
    interval: summaryBarChart.interval,
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { show: false },
    axisLabel: {
      color: '#a6a8b1', // Black/20
      fontSize: 11,
      fontFamily: 'Inter, sans-serif',
      // 設計稿只標示 20k ～ 100k，不顯示 0
      formatter: (value: number | string) => {
        const amount = Number(value)
        return amount === 0 ? '' : `${amount / 1000}k`
      },
    },
  },
  series: [
    {
      type: 'bar',
      data: summaryBarChart.data.map((item) => item.value),
      barWidth: summaryBarChart.barWidth,
      itemStyle: {
        color: summaryBarChart.color,
        borderRadius: 50,
      },
    },
  ],
}))
</script>

<template>
  <article class="summary-chart-card">
    <div class="summary-chart-card__head">
      <h2 class="summary-chart-card__title">{{ summaryBarChart.title }}</h2>

      <div class="summary-chart-card__tabs">
        <span class="summary-chart-card__tab summary-chart-card__tab--active">
          {{ summaryBarChart.tabs[0] }}
        </span>
        <span class="summary-chart-card__tab">{{ summaryBarChart.tabs[1] }}</span>
      </div>
    </div>

    <BaseChart :option="option" :height="300" />
  </article>
</template>

<style scoped lang="scss">
.summary-chart-card {
  display: flex;
  flex-direction: column;
  gap: 36px;
  padding: 15px 20px;
  background-color: $white;
  border-radius: $radius-lg;

  &__head {
    @include flex(row, space-between, center, 12px);
  }

  &__title {
    @include text-body-1(500);
    color: $black-60;
  }

  &__tabs {
    @include flex(row, center, center, 12px);
    padding: 5px 12px;
    background-color: $primary-8;
    border-radius: $radius-md;
  }

  &__tab {
    @include text-label-1;
    color: $black-100;
    white-space: nowrap;

    &--active {
      @include text-body-2;
      color: $primary-100;
    }
  }

  @include media-mobile {
    gap: 20px;

    &__tabs {
      gap: 8px;
      padding: 4px 8px;
    }
  }
}
</style>
