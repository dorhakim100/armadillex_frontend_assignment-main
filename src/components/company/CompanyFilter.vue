<template>
  <fieldset class="filter-container q-pa-md" :class="isMobile = 'mobile'">
    <legend>Filters</legend>

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
  </fieldset>
</template>

<script setup>
import { defineProps, computed } from 'vue'

import { useSystemStore } from 'src/stores/system'

import { checkboxFilters } from '../../config/company/filters'
import { countries } from '../../config/company/countries'

const props = defineProps(['filter'])
const emit = defineEmits(['update'])

const store = useSystemStore()
const isMobile = computed(() => store.isMobile)

function updateField(field, value) {
  const newFilter = {
    ...props.filter,
    [field]: value,
  }

  emit('update', newFilter)
}
</script>

<style scoped lang="scss">
@import 'src/css/setup/_variables.scss';
.filter-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  gap: 1rem;
  padding: 1rem 1.2rem;
  font-size: 1.1rem;

  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1.2rem 1.5rem;
  margin-bottom: 1.5rem;

  legend {
    font-weight: 600;
    font-size: 1.1rem;
    padding: 0 0.5rem;
    color: #2c3e50;
  }

  @media (max-width: $break-narrow) {
    align-self: end;
    top: calc($header-height + 0.5rem);
    width: calc(100vw - 3.5em);
    z-index: 200;
    margin-bottom: 0.5rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.253);

    legend {
      background-color: #f5f7fa;

      border-bottom: none;
      border-radius: 6px 6px 0 0;
    }
  }

  .filter-inputs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: center;
    gap: 1.2rem;
    label {
      padding-bottom: 0.3rem;
    }

    @media (max-width: $break-narrow) {
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
