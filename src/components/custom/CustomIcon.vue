<template>
  <div class="icon-wrapper">
    <q-icon :name="icon.name" :color="icon.color" />
    <span>{{ capitalizeFirstLetter(icon.field) }}</span>
  </div>
  <q-separator vertical v-if="props.isSeparator" />
</template>

<script setup>
import { defineProps } from 'vue'
import { capitalizeFirstLetter } from 'src/services/util.service'

const props = defineProps({
  icon: {
    type: Object,
    required: true,
  },
  isSeparator: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
.icon-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  text-align: center;
  gap: 0.5rem;

  i {
    align-self: center;
    font-size: 1.5rem;
  }

  span {
    font-size: 0.8rem;
  }
}
</style>
