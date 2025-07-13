<template>
  <div class="container">
    <q-input
      filled
      bottom-slots
      :model-value="props.filter.txt"
      label="Name"
      @update:model-value="(val) => updateField('txt', val)"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:append>
        <q-icon name="close" class="cursor-pointer" @click="() => updateField('txt', '')" />
      </template>
    </q-input>
    <q-select
      filled
      v-model="props.filter.country"
      :options="countries"
      label="Filled"
      @update:model-value="(val) => updateField('country', val)"
    />
    <!-- <date-picker  /> -->

    <q-checkbox
      v-for="(checkbox, index) in checkboxFilters"
      :key="index"
      v-model="props.filter[checkbox.key]"
      :label="checkbox.label"
      @update:model-value="(val) => updateField(checkbox.key, val)"
    />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import DatePicker from './FilterCmps/DatePicker.vue'
import { countries, checkboxFilters } from '../../composables/useCompanyFilter'

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
