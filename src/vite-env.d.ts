/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API 根位址；未設定時請求走相對路徑。 */
  readonly VITE_API_BASE_URL?: string
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}
