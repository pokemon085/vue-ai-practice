<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterView, useRoute } from 'vue-router'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()
const { sidebarCollapsed, isMobile, mobileDrawerOpen } = storeToRefs(uiStore)

const route = useRoute()

/**
 * 手機版一律以抽屜呈現（不套用桌面版的收合寬度），
 * 因此這裡把兩份狀態合併成 Sidebar 實際要用的單一值。
 */
const sidebarInCollapsedMode = computed(() => !isMobile.value && sidebarCollapsed.value)

// 抽屜開啟時才渲染遮罩；點擊遮罩或按 Esc 皆可關閉
const showOverlay = computed(() => isMobile.value && mobileDrawerOpen.value)

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && mobileDrawerOpen.value) {
    uiStore.closeDrawer()
  }
}

// 手機版點選選單後會換頁，抽屜應自動收起
const stopRouteWatch = watch(
  () => route.path,
  () => uiStore.closeDrawer(),
)

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  stopRouteWatch()
})
</script>

<template>
  <div class="app-layout">
    <AppSidebar
      :collapsed="sidebarInCollapsedMode"
      :mobile-open="mobileDrawerOpen"
      @close="uiStore.closeDrawer()"
    />

    <div v-if="showOverlay" class="app-layout__overlay" @click="uiStore.closeDrawer()" />

    <div class="app-layout__main">
      <AppHeader />

      <main class="app-layout__content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-layout {
  display: flex;
  min-height: 100vh;
  background-color: $main-background;

  &__main {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
  }

  &__content {
    flex: 1;
    min-width: 0;
    padding: $content-padding;
  }

  &__overlay {
    position: fixed;
    inset: 0;
    z-index: $z-overlay;
    background-color: $overlay-background;
  }

  @include media-tablet {
    &__content {
      padding: 24px 19px;
    }
  }

  @include media-mobile {
    &__content {
      padding: 16px;
    }
  }
}
</style>
