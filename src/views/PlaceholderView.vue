<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const title = computed(() => (route.meta.title as string | undefined) ?? 'Page')
</script>

<template>
  <section class="placeholder">
    <h2 class="placeholder__title">{{ title }}</h2>
    <p class="placeholder__text">此頁面將於後續階段依 Figma 設計稿實作。</p>
  </section>
</template>

<style scoped lang="scss">
.placeholder {
  @include surface-card;
  padding: 24px;

  &__title {
    @include text-heading-3(500);
    color: $black-60;
  }

  &__text {
    @include text-body-2;
    margin-top: 8px;
    color: $black-30;
  }
}
</style>
