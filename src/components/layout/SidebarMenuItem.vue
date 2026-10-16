<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import type { NavItem } from '@/data/navigation'

defineProps<{
  item: NavItem
  active: boolean
  collapsed: boolean
}>()
</script>

<template>
  <RouterLink
    :to="item.to"
    class="menu-item"
    :class="{ 'menu-item--active': active, 'menu-item--collapsed': collapsed }"
    :title="collapsed ? item.label : undefined"
  >
    <AppIcon class="menu-item__icon" :name="item.icon" :size="24" />
    <span v-if="!collapsed" class="menu-item__label">{{ item.label }}</span>
    <span v-if="!collapsed && item.badge" class="menu-item__badge">{{ item.badge }}</span>
  </RouterLink>
</template>

<style scoped lang="scss">
.menu-item {
  @include flex(row, flex-start, center, 16px);
  @include text-body-2;
  // 整列皆為可點擊區域（設計稿的「menu item」為 hug 寬度，此處改為撐滿內容寬度，
  // 但水平 padding 維持 20px，因此視覺位置與設計稿一致）
  width: 100%;
  min-height: 32px;
  padding: 4px 20px;
  color: $black-50;
  border-radius: $radius-lg;
  transition:
    color $transition-base,
    background-color $transition-base;

  &:hover {
    color: $black-100;
    background-color: $main-background;
  }

  &--active,
  &--active:hover {
    min-height: 56px;
    padding: 16px 20px;
    color: $white;
    background-color: $primary-100;
  }

  &--collapsed {
    justify-content: center;
    height: 56px;
    padding: 0;

    &.menu-item--active {
      padding: 0;
    }
  }

  &__icon {
    color: $icon-default;
  }

  &:hover &__icon {
    color: $black-100;
  }

  &--active &__icon,
  &--active:hover &__icon {
    color: inherit;
  }

  &__label {
    white-space: nowrap;
  }

  &__badge {
    @include flex(row, center, center);
    @include text-label-1;
    width: 24px;
    height: 24px;
    color: $black-100;
    background-color: $secondary-100;
    border-radius: $radius-pill;
  }
}
</style>
