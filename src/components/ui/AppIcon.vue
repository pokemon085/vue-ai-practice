<script setup lang="ts">
import { computed } from 'vue'
import { icons, type IconName } from '@/assets/icons'

const props = withDefaults(
  defineProps<{
    name: IconName
    /** 設計稿中圖示尺寸為 16 / 20 / 24px */
    size?: number
  }>(),
  { size: 24 },
)

const maskStyle = computed(() => {
  const url = `url("${icons[props.name]}")`
  return {
    width: `${props.size}px`,
    height: `${props.size}px`,
    WebkitMaskImage: url,
    maskImage: url,
  }
})
</script>

<template>
  <span class="app-icon" :style="maskStyle" aria-hidden="true" />
</template>

<style scoped lang="scss">
.app-icon {
  @include icon-mask;
  // 尺寸與 mask 影像由 inline style 帶入（依 name 動態決定）
}
</style>
