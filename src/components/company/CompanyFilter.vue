<template>
  <div class="container">
    <q-input
      filled
      bottom-slots
      :model-value="props.filter.txt"
      label="Name"
      :dense="dense"
      @update:model-value="(val) => updateField('txt', val)"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:append>
        <q-icon name="close" class="cursor-pointer" @click="updateField('txt', '')" />
      </template>
    </q-input>
    <q-select filled v-model="model" :options="options" label="Filled" />
    <date-picker />
    <q-checkbox v-model="right" label="Label on Right" />
    <q-checkbox v-model="right" label="Label on Right" />
    <q-checkbox v-model="right" label="Label on Right" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import DatePicker from './FilterCmps/DatePicker.vue'
import { log } from 'src/services/log.service'

const props = defineProps(['filter'])
const filter = props.filter
const emit = defineEmits(['update'])

function updateField(field, value) {
  filter[field] = value

  emit('update', { ...filter })
}
</script>

<style scoped lang="scss">
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));

  gap: 1.2rem;
  padding: 1.2rem;
  border-radius: 8px;
  background-color: #fafafa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}
</style>
