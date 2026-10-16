<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import type { SummaryCardData } from '@/data/dashboard'

/**
 * Dashboard 的 Summary Card（設計稿元件 Type=Double / Type=Tripple）。
 * 兩種變體只差在 metric 數量，因此用同一顆元件搭配 metrics 陣列呈現。
 */
const props = defineProps<{
  card: SummaryCardData
}>()

const isPrimary = computed(() => props.card.tone === 'primary')

/** 圖示方塊底色：藍卡固定用白色 tint，其餘依 iconTone。 */
const iconToneClass = computed(() => {
  if (isPrimary.value) return 'summary-card__icon--on-primary'
  return props.card.iconTone === 'secondary'
    ? 'summary-card__icon--secondary'
    : 'summary-card__icon--primary'
})
</script>

<template>
  <article
    class="summary-card"
    :class="{ 'summary-card--primary': isPrimary }"
    :aria-label="card.title"
  >
    <div class="summary-card__head">
      <span class="summary-card__icon" :class="iconToneClass">
        <AppIcon :name="card.icon" :size="20" />
      </span>

      <button v-if="card.filterLabel" type="button" class="summary-card__filter">
        {{ card.filterLabel }}
        <AppIcon name="chevronDown" :size="16" />
      </button>
    </div>

    <div class="summary-card__metrics">
      <div v-for="metric in card.metrics" :key="metric.label" class="summary-card__metric">
        <span
          class="summary-card__label"
          :class="{ 'summary-card__label--danger': metric.labelTone === 'danger' }"
        >
          {{ metric.label }}
        </span>

        <span class="summary-card__value">
          {{ metric.value }}
          <span
            v-if="metric.delta"
            class="summary-card__delta"
            :class="metric.deltaTone ? `summary-card__delta--${metric.deltaTone}` : undefined"
          >
            {{ metric.delta }}
          </span>
        </span>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.summary-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  min-height: 145px;
  padding: 11px 15px;
  background-color: $white;
  border-radius: $radius-lg;

  &__head {
    @include flex(row, space-between, center, 10px);
  }

  &__icon {
    @include flex(row, center, center);
    flex: none;
    width: 36px;
    height: 36px;
    border-radius: $radius-md;

    &--primary {
      color: $primary-100;
      background-color: $primary-12;
    }

    &--secondary {
      color: $black-100;
      background-color: $secondary-16;
    }

    &--on-primary {
      color: $white;
      background-color: $white-16;
    }
  }

  &__filter {
    @include flex(row, flex-end, center, 7px);
    @include text-label-1;
    color: $black-10;
    white-space: nowrap;

    &:hover {
      color: $black-30;
    }
  }

  // 設計稿的 metric 為「標籤在上、數值在下」，彼此以 32px 間距並排。
  // 允許換行：卡片變窄時（例如 Sales 的 ₦4,000,000.00 與 Volume 並排）
  // 會自動折到下一行，而不是讓數值互相重疊。
  &__metrics {
    @include flex(row, flex-start, flex-start, 32px);
    flex-wrap: wrap;
  }

  &__metric {
    display: flex;
    flex-direction: column;
    // 不壓縮、不成長：寬度由內容決定，因此內容放不下時才會觸發換行
    flex: 0 0 auto;
    gap: 8px;
  }

  &__label {
    @include text-body-2;
    color: $black-30;
    white-space: nowrap;

    &--danger {
      color: $action-red;
    }
  }

  &__value {
    @include flex(row, flex-start, center, 7px);
    @include text-heading-3(500);
    color: $black-60;
    white-space: nowrap;
  }

  &__delta {
    @include text-label-1;
    color: $black-40;
    white-space: nowrap;

    &--up {
      color: $action-green;
    }

    &--down {
      color: $action-red;
    }
  }

  // 藍色卡片的文字全部改為白色系
  &--primary {
    background-color: $primary-100;

    .summary-card__label,
    .summary-card__value {
      color: $white;
    }

    .summary-card__delta {
      color: $primary-10;
    }
  }

  // 平板區間（769～1280px）卡片較窄，縮小 metric 間距避免擠壓
  @include media-tablet {
    &__metrics {
      gap: 18px;
    }
  }

  @include media-mobile {
    min-height: 0;

    &__metrics {
      gap: 20px;
    }
  }
}
</style>
