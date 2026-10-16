<script setup lang="ts">
import { computed } from 'vue'
import type { EChartsOption } from 'echarts'
import BaseChart from '@/components/charts/BaseChart.vue'
import { marketingKeys, marketingTitle } from '@/data/dashboard'

/**
 * 「Marketting」圓餅圖卡片。
 * 設計稿的圓餅圖是匯出的 SVG（沒有原始數據），此處以示意資料搭配 ECharts 重繪，
 * 圖例則維持以 HTML 呈現（可讀性與樣式都比 ECharts 內建 legend 精準）。
 */
const option = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {d}%',
  },
  series: [
    {
      type: 'pie',
      // 外圈刻意留 5% 的餘裕：hover 時 ECharts 會把扇區半徑 +5px（emphasis.scaleSize），
      // 若外圈直接用到 100%，放大後會超出 canvas 邊界而被切掉。
      radius: ['58%', '95%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: false,
      label: { show: false },
      labelLine: { show: false },
      data: marketingKeys.map((key) => ({
        name: key.label,
        value: key.value,
        itemStyle: { color: key.color },
      })),
    },
  ],
}))
</script>

<template>
  <article class="marketing-card">
    <div class="marketing-card__head">
      <h2 class="marketing-card__title">{{ marketingTitle }}</h2>

      <ul class="marketing-card__keys">
        <li v-for="key in marketingKeys" :key="key.label" class="marketing-card__key">
          <span class="marketing-card__chip" :style="{ backgroundColor: key.color }" />
          <span class="marketing-card__key-label">{{ key.label }}</span>
        </li>
      </ul>
    </div>

    <BaseChart class="marketing-card__chart" :option="option" :height="205" />
  </article>
</template>

<style scoped lang="scss">
.marketing-card {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
  padding: 21px 20px;
  background-color: $white;
  border-radius: $radius-lg;

  &__head {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__title {
    @include text-body-1(500);
    color: $black-60;
  }

  &__keys {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  &__key {
    @include flex(row, flex-start, center, 8px);
    min-width: 0;
  }

  &__chip {
    flex: none;
    width: 8px;
    height: 8px;
    border-radius: $radius-sm;
  }

  &__key-label {
    @include text-label-2;
    overflow: hidden;
    color: $black-20;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__chart {
    align-self: center;
  }

  @include media-mobile {
    // 手機版圖例改為可換行，避免三個圖例被壓縮
    &__keys {
      flex-wrap: wrap;
      justify-content: flex-start;
      gap: 12px 20px;
    }
  }
}
</style>
