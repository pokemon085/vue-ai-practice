<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import SidebarMenuItem from './SidebarMenuItem.vue'
import { mainNavItems, sidebarExtras } from '@/data/navigation'
import { logoUrl } from '@/assets/icons'

defineProps<{
  /** 桌面／平板的收合狀態（手機版固定為展開）。 */
  collapsed: boolean
  /** 手機版抽屜是否開啟。 */
  mobileOpen: boolean
}>()

const emit = defineEmits<{ close: [] }>()

const route = useRoute()

/** 依目前路由判斷選中項目，包含子路徑。 */
const isActive = (to: string) => route.path === to || route.path.startsWith(`${to}/`)
</script>

<template>
  <aside
    class="sidebar"
    :class="{ 'sidebar--collapsed': collapsed, 'sidebar--mobile-open': mobileOpen }"
  >
    <button
      v-if="mobileOpen"
      type="button"
      class="sidebar__close"
      aria-label="Close menu"
      @click="emit('close')"
    />

    <RouterLink to="/dashboard" class="sidebar__logo">
      <img class="sidebar__logo-mark" :src="logoUrl" alt="Metrix" width="52" height="52" />
      <span v-if="!collapsed" class="sidebar__logo-text">Metrix</span>
    </RouterLink>

    <nav class="sidebar__nav" aria-label="Main navigation">
      <ul class="sidebar__menu">
        <li v-for="item in mainNavItems" :key="item.to">
          <SidebarMenuItem :item="item" :collapsed="collapsed" :active="isActive(item.to)" />
        </li>
      </ul>
    </nav>

    <div class="sidebar__bottom">
      <button
        type="button"
        class="sidebar__support"
        :title="collapsed ? sidebarExtras.support.label : undefined"
      >
        <AppIcon :name="sidebarExtras.support.icon" :size="24" />
        <span v-if="!collapsed">{{ sidebarExtras.support.label }}</span>
      </button>

      <div class="sidebar__banner" :title="collapsed ? sidebarExtras.banner.title : undefined">
        <AppIcon class="sidebar__banner-icon" :name="sidebarExtras.banner.icon" :size="24" />
        <div v-if="!collapsed" class="sidebar__banner-body">
          <span class="sidebar__banner-title">{{ sidebarExtras.banner.title }}</span>
          <span class="sidebar__banner-subtitle">
            {{ sidebarExtras.banner.subtitle }}
            <AppIcon name="chevronDown" :size="16" />
          </span>
        </div>
      </div>

      <button type="button" class="sidebar__logout">
        <AppIcon :name="sidebarExtras.logout.icon" :size="24" />
        <span v-if="!collapsed">{{ sidebarExtras.logout.label }}</span>
      </button>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.sidebar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  flex: none;
  flex-direction: column;
  width: $sidebar-width;
  height: 100vh;
  padding: 14px 32px 37px;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: $white;
  transition:
    width $transition-base,
    padding $transition-base;

  // ── Logo ──────────────────────────────────────────────────────────────────
  &__logo {
    @include flex(row, flex-start, center, 6px);
    flex: none;
    margin-left: 2px;
  }

  &__logo-mark {
    flex: none;
    width: 52px;
    height: 52px;
  }

  &__logo-text {
    @include text-heading-3(700);
    white-space: nowrap;
    color: $black-60;
  }

  // ── 選單 ──────────────────────────────────────────────────────────────────
  &__nav {
    margin-top: 62px;
  }

  &__menu {
    display: flex;
    flex-direction: column;
    // 設計稿為 24px，但選單項目加了 4px 上下 padding（放大可點區域），
    // 因此 gap 縮為 16px，讓圖示中心間距維持設計稿的 48px。
    gap: 16px;
  }

  // ── 底部區塊 ──────────────────────────────────────────────────────────────
  &__bottom {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: auto;
  }

  &__support,
  &__logout {
    @include flex(row, flex-start, center, 12px);
    @include text-body-2;
    width: 100%;
    min-height: 46px;
    padding: 11px 16px;
    border-radius: $radius-xl;
    transition: background-color $transition-base;
  }

  &__support {
    color: $black-100;
    background-color: $sidebar-support-background;

    &:hover {
      background-color: rgba(94, 99, 102, 0.16);
    }
  }

  &__banner {
    @include flex(row, flex-start, center, 12px);
    padding: 11px 20px;
    background-color: $sidebar-banner-background;
    border-radius: $radius-xl;
  }

  &__banner-icon {
    color: $black-100;
  }

  &__banner-body {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__banner-title {
    @include text-body-2;
    color: $black-100;
    white-space: nowrap;
  }

  &__banner-subtitle {
    @include flex(row, flex-start, center, 8px);
    @include text-label-1;
    color: $black-40;
    white-space: nowrap;
  }

  &__logout {
    margin-top: 9px;
    color: $action-red;

    &:hover {
      background-color: $sidebar-logout-hover;
    }
  }

  // ── 收合狀態（設計稿 88px 寬）─────────────────────────────────────────────
  &--collapsed {
    width: $sidebar-width-collapsed;
    padding: 14px 16px 37px;

    .sidebar__menu {
      gap: 12px;
    }

    .sidebar__support,
    .sidebar__logout {
      justify-content: center;
      padding: 11px 0;
    }

    // 收合時橫幅縮為 56x56（僅保留圖示）
    .sidebar__banner {
      justify-content: center;
      width: 56px;
      height: 56px;
      padding: 0;
    }

    .sidebar__logout {
      margin-top: 35px;
    }
  }

  // ── 手機版關閉鈕（僅在抽屜開啟時渲染）────────────────────────────────────
  &__close {
    @include reset-button;
    position: absolute;
    top: 18px;
    right: 16px;
    width: 36px;
    height: 36px;
    color: $black-60;
    border-radius: $radius-md;
    transition: background-color $transition-base;

    &:hover {
      background-color: $main-background;
    }

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 16px;
      height: 2px;
      background-color: currentColor;
      border-radius: 2px;
    }

    &::before {
      transform: translate(-50%, -50%) rotate(45deg);
    }

    &::after {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  }

  // ── 手機版：改為抽屜式選單（≤ 768px）──────────────────────────────────────
  @include media-mobile {
    position: fixed;
    top: 0;
    left: 0;
    z-index: $z-sidebar-drawer;
    // 保留右側一小段可見寬度，讓使用者看得出這是可關閉的抽屜
    width: min(#{$sidebar-width}, calc(100% - #{$drawer-gap}));
    box-shadow: $shadow-card;
    visibility: hidden;
    transform: translateX(-100%);
    transition:
      transform $transition-base,
      visibility $transition-base;

    &--mobile-open {
      visibility: visible;
      transform: translateX(0);
    }
  }
}
</style>
