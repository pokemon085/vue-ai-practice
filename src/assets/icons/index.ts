import chevronDown from './icon-chevron-down.svg'
import conversations from './icon-conversations.svg'
import customers from './icon-customers.svg'
import dashboard from './icon-dashboard.svg'
import gift from './icon-gift.svg'
import headphones from './icon-headphones.svg'
import home from './icon-home.svg'
import inventory from './icon-inventory.svg'
import logout from './icon-logout.svg'
import notification from './icon-notification.svg'
import orders from './icon-orders.svg'
import settings from './icon-settings.svg'

/**
 * 單色圖示集合（來源：Figma 的 IMAGE-SVG 節點，以 download_figma_images 匯出）。
 * 這些圖示會被當成 CSS mask 使用，因此顏色由 currentColor 決定。
 */
export const icons = {
  chevronDown,
  conversations,
  customers,
  dashboard,
  gift,
  headphones,
  home,
  inventory,
  logout,
  notification,
  orders,
  settings,
} as const

export type IconName = keyof typeof icons

/** 品牌 Logo 為雙色圖形，需以 <img> 呈現，不可用 mask 上色。 */
export { default as logoUrl } from './logo.svg'
