<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
import type { OrderItem } from '@/data/dashboard'

/**
 * Recent Orders 的單筆訂單（設計稿元件 orderCard，底部有一條 1px 分隔線）。
 * 商品縮圖因 Figma API 速率上限無法匯出，先以佔位色塊＋圖示呈現。
 */
defineProps<{
  order: OrderItem
}>()
</script>

<template>
  <article class="order-card">
    <div class="order-card__thumb" :class="`order-card__thumb--${order.thumbTone}`">
      <AppIcon name="inventory" :size="20" />
    </div>

    <div class="order-card__content">
      <div class="order-card__row">
        <span class="order-card__name">{{ order.name }}</span>
        <span class="order-card__date">{{ order.date }}</span>
      </div>

      <div class="order-card__row order-card__row--bottom">
        <span class="order-card__amount">{{ order.amount }}</span>
        <span
          class="order-card__status"
          :class="`order-card__status--${order.status.toLowerCase()}`"
        >
          {{ order.status }}
        </span>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.order-card {
  display: flex;
  gap: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid $stroke;

  &__thumb {
    @include flex(row, center, center);
    flex: none;
    width: 49px;
    height: 49px;
    color: $primary-100;
    background-color: $primary-12;
    border: 1px solid $stroke;
    border-radius: $radius-md;

    &--secondary {
      color: $black-40;
      background-color: $secondary-16;
    }
  }

  &__content {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 10px;
    min-width: 0;
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;

    &--bottom {
      align-items: flex-end;
    }
  }

  &__name {
    @include text-body-2;
    overflow: hidden;
    color: $black-60;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__date {
    @include text-label-1;
    flex: none;
    color: $black-20;
    white-space: nowrap;
  }

  &__amount {
    @include text-body-2(500);
    overflow: hidden;
    color: $black-80;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__status {
    @include text-label-1;
    flex: none;
    padding: 2px 15px;
    border-radius: $radius-md;
    white-space: nowrap;

    &--pending {
      color: $action-red;
      background-color: $status-pending-background;
    }

    &--completed {
      color: $action-green;
      background-color: $status-completed-background;
    }
  }
}
</style>
