<template>
  <div class="container">
    <slot name="title">
      <h1>{{ count }}</h1>
    </slot>
    <button @click="increment" aria-label="Increase count">Increment</button>
  </div>
</template>

<script setup>
const props = defineProps(['initialCount'])
const emit = defineEmits(['update'])

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
