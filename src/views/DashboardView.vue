<script setup lang="ts">
import SummaryCard from '@/components/dashboard/SummaryCard.vue'
import MarketingDonutCard from '@/components/dashboard/MarketingDonutCard.vue'
import SummaryChartCard from '@/components/dashboard/SummaryChartCard.vue'
import OrderSummaryPanel from '@/components/dashboard/OrderSummaryPanel.vue'
import { dashboardSideCards, dashboardSummaryCards } from '@/data/dashboard'

/**
 * Dashboard 靜態視覺。
 * 版面依 Figma：#12:9517 → 上方三張 Summary Card、下方左側（圓餅圖＋兩張卡＋長條圖）
 * 與右側 Order Summary。此階段尚未串接 API，資料來自 src/data/dashboard.ts。
 */
</script>

<template>
  <div class="dashboard">
    <section class="dashboard__cards" aria-label="Summary">
      <SummaryCard v-for="card in dashboardSummaryCards" :key="card.title" :card="card" />
    </section>

    <div class="dashboard__body">
      <div class="dashboard__left">
        <div class="dashboard__left-top">
          <MarketingDonutCard />

          <div class="dashboard__side">
            <SummaryCard v-for="card in dashboardSideCards" :key="card.title" :card="card" />
          </div>
        </div>

        <SummaryChartCard />
      </div>

      <OrderSummaryPanel class="dashboard__orders" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;

  // 上方三張 Summary Card（設計稿：row gap 19px）
  &__cards {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 19px;
  }

  // 下方主內容：左側圖表區 + 右側 Order Summary（設計稿：row gap 18px）
  &__body {
    display: flex;
    align-items: flex-start;
    gap: 18px;
  }

  &__left {
    display: flex;
    flex: 3 1 0;
    flex-direction: column;
    gap: 20px;
    min-width: 0;
  }

  // 圓餅圖卡與右側兩張卡片並排
  &__left-top {
    display: flex;
    align-items: stretch;
    gap: 20px;
  }

  // 兩張卡片等高排列
  &__side {
    display: grid;
    flex: 1;
    grid-auto-rows: 1fr;
    gap: 19px;
    min-width: 0;
  }

  &__orders {
    flex: 2 1 0;
    min-width: 0;
  }

  // ── 平板（769～1280px）：卡片允許自動換行，避免被壓縮 ─────────────────────
  @include media-tablet {
    &__cards {
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }
  }

  // ── 手機（≤ 768px）：全部改為單欄堆疊 ────────────────────────────────────
  @include media-mobile {
    &__cards {
      grid-template-columns: minmax(0, 1fr);
      gap: 16px;
    }

    &__body {
      flex-direction: column;
    }

    &__left,
    &__orders {
      flex: none;
      width: 100%;
    }

    &__left-top {
      flex-direction: column;
    }

    &__side {
      grid-auto-rows: auto;
      gap: 16px;
    }
  }
}
</style>
