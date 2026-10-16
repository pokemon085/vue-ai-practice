<script setup lang="ts">
import OrderCard from './OrderCard.vue'
import { recentOrderPanelTitle, recentOrders } from '@/data/dashboard'
</script>

<template>
  <article class="order-panel">
    <h2 class="order-panel__title">{{ recentOrderPanelTitle }}</h2>

    <div class="order-panel__list">
      <OrderCard
        v-for="(order, index) in recentOrders"
        :key="`${order.name}-${index}`"
        :order="order"
      />
    </div>
  </article>
</template>

<style scoped lang="scss">
.order-panel {
  display: flex;
  flex-direction: column;
  gap: 23px;
  padding: 20px;
  background-color: $white;
  border-radius: $radius-lg;

  &__title {
    @include text-body-1(500);
    color: $black-60;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 23px;
  }

  // 最後一筆不需要底部分隔線
  &__list > :last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
}
</style>
