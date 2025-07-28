<template>
  <q-inner-loading
    :showing="props.showing"
    :label="props.label || 'Loading...'"
    label-class="text-teal"
    label-style="font-size: 1.1em"
    class="custom-inner-loading"
  />
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps(['label', 'showing'])
</script>

<style scoped lang="scss">
.custom-inner-loading {
  background-color: rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(2px);
}
</style>
