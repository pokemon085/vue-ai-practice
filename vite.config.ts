import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        // 全站共用設計 token，所有 <style lang="scss"> 都能直接使用變數與 mixin
        additionalData: '@use "@/styles/variables" as *;\n@use "@/styles/mixins" as *;\n',
      },
    },
  },
})
