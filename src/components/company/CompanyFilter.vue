<template>
  <div class="filter-container q-pa-md">
    <div class="filter-inputs">
      <q-input
        filled
        dense
        bottom-slots
        :model-value="props.filter.txt"
        label="Search Name"
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
        dense
        :model-value="props.filter.country"
        :options="countries"
        label="Country"
        @update:model-value="(val) => updateField('country', val)"
        popup-content-class="custom-select-dropdown"
      />
    </div>

    <div class="filter-checkboxes">
      <q-checkbox
        v-for="(checkbox, index) in checkboxFilters"
        :key="index"
        :model-value="props.filter[checkbox.key]"
        :label="checkbox.label"
        @update:model-value="(val) => updateField(checkbox.key, val)"
        dense
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { checkboxFilters } from '../../config/company/filters'
import { countries } from '../../config/company/countries'

const props = defineProps(['filter'])
const emit = defineEmits(['update'])

function updateField(field, value) {
  // Don't mutate props - create a new object instead
  const newFilter = {
    ...props.filter,
    [field]: value,
  }

  emit('update', newFilter)
}
</script>

<style scoped lang="scss">
.filter-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  gap: 1rem;
  padding: 1rem 1.2rem;

  @media (max-width: 600px) {
    display: grid;
  }

  .filter-inputs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: center;
    gap: 1.2rem;
    label {
      padding-bottom: 0.3rem;
    }

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  .filter-checkboxes {
    display: flex;
    flex: 1 1 300px;
    flex-wrap: wrap;
    align-items: center;

    gap: 1.2rem;
  }
}
</style>
