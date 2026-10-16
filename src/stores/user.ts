import { defineStore } from 'pinia'
import { ref } from 'vue'
import avatarUrl from '@/assets/images/avatar.png'

/**
 * 使用者與目前店鋪資訊。
 * 放在 Pinia 是因為 Header 需要顯示，且後續登入流程會跨頁面共用。
 * 目前尚無登入 API，值為設計稿內容的預設值。
 */
export const useUserStore = defineStore('user', () => {
  /** 目前登入者頭像（設計稿素材）。 */
  const avatar = ref(avatarUrl)

  /** 目前店鋪名稱（設計稿 Top Nav 顯示的文字）。 */
  const storeName = ref('Nanny’s Shop')

  return { avatar, storeName }
})
