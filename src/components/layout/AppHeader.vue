<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, useRoute } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppBreadcrumbs from './AppBreadcrumbs.vue'
import { profileMenuItems } from '@/data/navigation'
import { useUiStore } from '@/stores/ui'
import { useUserStore } from '@/stores/user'

const route = useRoute()

/** 頁面標題由路由 meta 決定（設計稿的 Top Nav 標題為元件文字，未做個別覆寫） */
const title = computed(() => (route.meta.title as string | undefined) ?? '')

// 跨元件共用：Sidebar 狀態由 ui store 控制，Header 只負責觸發。
// 手機版切換抽屜，桌面／平板切換收合，實際判斷在 store 內。
const uiStore = useUiStore()

// 跨元件共用：登入者與店鋪資訊
const { avatar, storeName } = storeToRefs(useUserStore())

// 局部狀態：下拉選單開關只影響本元件，留在元件內
const menuOpen = ref(false)
const profileRef = ref<HTMLElement | null>(null)

const closeMenu = () => {
  menuOpen.value = false
}

const onDocumentClick = (event: MouseEvent) => {
  if (profileRef.value && !profileRef.value.contains(event.target as Node)) {
    closeMenu()
  }
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick))
</script>

<template>
  <header class="app-header">
    <div class="app-header__bar">
      <div class="app-header__left">
        <button
          type="button"
          class="app-header__toggle"
          aria-label="Toggle navigation"
          @click="uiStore.toggleNavigation()"
        >
          <span class="app-header__toggle-lines" />
        </button>
        <h1 class="app-header__title">{{ title }}</h1>
      </div>

      <div class="app-header__profile">
        <button type="button" class="app-header__store">
          <span>{{ storeName }}</span>
          <AppIcon name="chevronDown" :size="20" />
        </button>

        <button type="button" class="app-header__notification" aria-label="Notifications">
          <AppIcon name="notification" :size="20" />
        </button>

        <div ref="profileRef" class="app-header__account">
          <button
            type="button"
            class="app-header__avatar"
            aria-haspopup="menu"
            :aria-expanded="menuOpen"
            @click="menuOpen = !menuOpen"
          >
            <img :src="avatar" alt="User avatar" />
          </button>

          <div v-if="menuOpen" class="app-header__dropdown" role="menu">
            <template v-for="item in profileMenuItems" :key="item.label">
              <RouterLink
                v-if="item.to"
                class="app-header__dropdown-item"
                :class="{ 'app-header__dropdown-item--danger': item.danger }"
                :to="item.to"
                role="menuitem"
                @click="closeMenu"
              >
                {{ item.label }}
              </RouterLink>
              <!-- 無導向目標的項目（例如尚未實作的登出）以按鈕呈現，避免導向空字串 -->
              <button
                v-else
                type="button"
                class="app-header__dropdown-item"
                :class="{ 'app-header__dropdown-item--danger': item.danger }"
                role="menuitem"
                @click="closeMenu"
              >
                {{ item.label }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <AppBreadcrumbs />
  </header>
</template>

<style scoped lang="scss">
.app-header {
  position: sticky;
  top: 0;
  z-index: 9;
  background-color: $white;

  &__bar {
    @include flex(row, space-between, center, $header-bar-gap);
    padding: $header-bar-padding;
    background-color: $white;
  }

  &__left {
    @include flex(row, flex-start, center, 16px);
    min-width: 0;
  }

  // 收合切換鈕：設計稿未提供此按鈕，為展示 Sidebar 收合狀態而加入
  &__toggle {
    @include flex(row, center, center);
    flex: none;
    width: 24px;
    height: 24px;
    color: $black-60;
    border-radius: $radius-sm;

    &:hover {
      background-color: $main-background;
    }
  }

  &__toggle-lines,
  &__toggle-lines::before,
  &__toggle-lines::after {
    display: block;
    width: 16px;
    height: 2px;
    background-color: currentColor;
    border-radius: 2px;
  }

  &__toggle-lines {
    position: relative;

    &::before,
    &::after {
      content: '';
      position: absolute;
      left: 0;
    }

    &::before {
      top: -5px;
    }

    &::after {
      top: 5px;
    }
  }

  &__title {
    @include text-heading-3(500);
    overflow: hidden;
    color: $black-60;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__profile {
    @include flex(row, flex-end, center, 20px);
    flex: none;
  }

  &__store {
    @include flex(row, center, center, 20px);
    @include text-body-2;
    padding: 5px 12px;
    color: $black-100;
    background-color: $secondary-20;
    border-radius: $radius-md;

    .app-icon {
      color: $black-100;
    }
  }

  &__notification {
    @include flex(row, center, center);
    color: $icon-default;

    &:hover {
      color: $primary-100;
    }
  }

  &__account {
    position: relative;
  }

  &__avatar {
    display: block;
    width: 32px;
    height: 32px;
    overflow: hidden;
    border-radius: $radius-md;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    z-index: 20;
    min-width: 168px;
    padding: 8px;
    background-color: $white;
    border-radius: $radius-lg;
    box-shadow: $shadow-card;
  }

  &__dropdown-item {
    @include text-body-2;
    display: block;
    width: 100%;
    padding: 10px 12px;
    color: $black-60;
    text-align: left;
    border-radius: $radius-md;

    &:hover {
      background-color: $main-background;
    }

    &--danger {
      color: $action-red;
    }
  }

  // ── 手機版：隱藏非必要資訊，避免水平溢出（≤ 768px）──────────────────────
  @include media-mobile {
    &__bar {
      gap: 8px;
      padding: 12px 16px;
    }

    &__left {
      gap: 12px;
    }

    &__profile {
      gap: 12px;
    }

    // 店鋪切換在手機版屬非必要資訊，先隱藏以保留空間給頁面標題
    &__store {
      display: none;
    }
  }
}
</style>
