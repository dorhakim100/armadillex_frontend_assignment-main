<template>
  <div class="container"></div>
</template>

<script setup>
const props = defineProps(['initialCount'])
const emit = defineEmits(['update'])

const { count, increment: baseIncrement } = useCounter(props.initialCount || 0)

function increment() {
  baseIncrement()
  emit('update', count.value)
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}
</style>
