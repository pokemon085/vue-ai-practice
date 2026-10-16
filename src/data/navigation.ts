import type { IconName } from '@/assets/icons'

export interface NavItem {
  /** 選單文字（取自設計稿 sideBar 元件的 TEXT 節點） */
  label: string
  /** 對應的 Vue Router 路徑 */
  to: string
  /** 選單圖示（設計稿為 Iconly / fi 系列） */
  icon: IconName
  /** 設計稿中的右側數字徽章 */
  badge?: string
}

/** 主要選單；集中管理，避免在各頁面重複寫死。 */
export const mainNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: 'dashboard' },
  { label: 'Orders', to: '/orders', icon: 'orders', badge: '3' },
  { label: 'Customers', to: '/customers', icon: 'customers' },
  { label: 'Inventory', to: '/inventory', icon: 'inventory' },
  { label: 'Conversations', to: '/conversations', icon: 'conversations', badge: '16' },
  { label: 'Settings', to: '/settings', icon: 'settings' },
]

/** Sidebar 底部的支援入口與宣傳卡文字。 */
export const sidebarExtras = {
  support: { label: 'Contact Support', icon: 'headphones' as IconName },
  banner: {
    title: 'Free Gift Awaits You!',
    subtitle: 'Upgrade your account',
    icon: 'gift' as IconName,
  },
  logout: { label: 'Logout', icon: 'logout' as IconName },
}

/** 頭像下拉選單項目。設計稿未提供此下拉，內容為本階段最小實作。 */
export interface ProfileMenuItem {
  label: string
  /** 有值時渲染為 RouterLink；未提供時渲染為按鈕（不導向空字串）。 */
  to?: string
  danger?: boolean
}

export const profileMenuItems: ProfileMenuItem[] = [
  { label: 'Profile', to: '/settings' },
  { label: 'Settings', to: '/settings' },
  // 尚無登入流程與登入頁，因此先不給導向目標；待實作後再補上。
  { label: 'Logout', danger: true },
]
