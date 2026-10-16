import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/**
 * 與 styles/_variables.scss 的 $breakpoint-mobile / $breakpoint-desktop 保持一致。
 * （SCSS 變數無法直接給 TS 使用，因此兩邊各存一份，修改時必須同步。）
 */
export const BREAKPOINT_MOBILE = 768
export const BREAKPOINT_DESKTOP = 1280

/** 依視窗寬度切分的三種版面區間。 */
export type ViewportZone = 'mobile' | 'tablet' | 'desktop'

const resolveZone = (width: number): ViewportZone => {
  if (width <= BREAKPOINT_MOBILE) return 'mobile'
  if (width <= BREAKPOINT_DESKTOP) return 'tablet'
  return 'desktop'
}

/**
 * 全域 UI 狀態。
 * 只放「需要跨元件共用」的介面狀態：
 * - sidebarCollapsed：桌面版（> 1280px）的 Sidebar 收合，AppLayout / AppHeader 共用。
 * - viewportZone / mobileDrawerOpen：手機版（≤ 768px）的抽屜開關，AppLayout / AppSidebar / AppHeader 共用。
 * 兩者刻意分開，避免桌面的收合狀態與手機的抽屜開關互相干擾。
 * 彈窗、下拉選單等單一元件內的開關仍留在各元件的 ref。
 */
export const useUiStore = defineStore('ui', () => {
  /** 桌面版 Sidebar 是否收合（僅 > 1280px 生效）。 */
  const sidebarCollapsed = ref(false)

  /** 目前視窗寬度落在哪個區間；尚未初始化前為 null。 */
  const viewportZone = ref<ViewportZone | null>(null)

  /** 手機版抽屜是否開啟（僅 ≤ 768px 生效）。 */
  const mobileDrawerOpen = ref(false)

  const isMobile = computed(() => viewportZone.value === 'mobile')
  const isTablet = computed(() => viewportZone.value === 'tablet')

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const setSidebarCollapsed = (value: boolean) => {
    sidebarCollapsed.value = value
  }

  const openDrawer = () => {
    mobileDrawerOpen.value = true
  }

  const closeDrawer = () => {
    mobileDrawerOpen.value = false
  }

  const toggleDrawer = () => {
    mobileDrawerOpen.value = !mobileDrawerOpen.value
  }

  /** Header 的漢堡鈕：手機版開關抽屜，其餘區間切換桌面的收合狀態。 */
  const toggleNavigation = () => {
    if (isMobile.value) {
      toggleDrawer()
    } else {
      toggleSidebar()
    }
  }

  /**
   * 套用新版面區間。
   * 只在「跨越斷點」時才重設狀態，因此同一區間內使用者手動切換的結果會被保留；
   * 也因為兩者分開，從手機放大回桌面時不會殘留抽屜開啟狀態。
   */
  const applyZone = (zone: ViewportZone) => {
    if (zone === viewportZone.value) return

    viewportZone.value = zone
    mobileDrawerOpen.value = false
    sidebarCollapsed.value = zone === 'tablet'
  }

  const syncViewport = () => {
    applyZone(resolveZone(window.innerWidth))
  }

  if (typeof window !== 'undefined') {
    // 首次載入先套用對應區間的預設狀態，之後只監聽跨斷點的變化。
    applyZone(resolveZone(window.innerWidth))
    window.addEventListener('resize', syncViewport)
  }

  return {
    sidebarCollapsed,
    viewportZone,
    mobileDrawerOpen,
    isMobile,
    isTablet,
    toggleSidebar,
    setSidebarCollapsed,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    toggleNavigation,
  }
})
