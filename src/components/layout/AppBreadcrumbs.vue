<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'

export interface BreadcrumbItem {
  label: string
  to?: string
}

defineProps<{
  /** 設計稿中所有頁面的麵包屑項目都是隱藏的，僅顯示 Home 圖示，因此預設為空。 */
  items?: BreadcrumbItem[]
}>()
</script>

<template>
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <div class="breadcrumbs__content">
      <RouterLink to="/dashboard" class="breadcrumbs__home" aria-label="Home">
        <AppIcon name="home" :size="16" />
      </RouterLink>

      <template v-for="(item, index) in items ?? []" :key="item.label">
        <span class="breadcrumbs__separator">/</span>
        <RouterLink
          v-if="item.to && index < (items?.length ?? 0) - 1"
          class="breadcrumbs__item"
          :to="item.to"
        >
          {{ item.label }}
        </RouterLink>
        <span v-else class="breadcrumbs__item breadcrumbs__item--current">{{ item.label }}</span>
      </template>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.breadcrumbs {
  padding: $breadcrumbs-padding;
  background-color: $white;
  border-top: 1px solid $stroke;

  &__content {
    @include flex(row, flex-start, center, 11px);
  }

  &__home {
    @include flex(row, center, center);
    color: $icon-default;

    &:hover {
      color: $primary-100;
    }
  }

  &__separator,
  &__item {
    @include text-label-1;
    color: $black-30;
  }

  &__item:hover {
    color: $black-60;
  }

  @include media-mobile {
    padding: 4px 16px;
  }
}
</style>
