<template>
  <q-inner-loading
    :showing="store.isLoading"
    :label="props.label || 'Loading...'"
    label-class="text-teal"
    label-style="font-size: 1.1em"
    class="custom-inner-loading"
  />
</template>

<script setup>
import { useSystemStore } from 'src/stores/system'

const props = defineProps(['label'])
// const emit = defineEmits(['update'])

const store = useSystemStore()
</script>

<style scoped lang="scss">
.custom-inner-loading {
  background-color: rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(2px);
  // border-radius: 8px;
}
</style>
