<template>
  <fieldset
    class="filter-container q-pa-md"
    :class="[isDarkMode ? 'dark-mode' : '', isMobile ? 'mobile' : '']"
  >
    <legend v-if="!isMobile">Filters</legend>
    <legend v-else>Filters & Sorting</legend>
    <q-btn
      v-if="isMobile"
      flat
      round
      color="primary"
      icon="close"
      @click="emit('closeModal')"
      class="close-button"
    />
    <div class="filter-inputs">
      <q-input
        filled
        dense
        bottom-slots
        :model-value="props.filter.txt"
        label="Name"
        @update:model-value="(val) => updateField('txt', val)"
        :dark="isDarkMode ? true : false"
      >
        <template v-slot:prepend v-if="!isMobile">
          <q-icon name="search" />
        </template>
        <template v-slot:append>
          <q-icon name="close" class="cursor-pointer" @click="() => updateField('txt', '')" />
        </template>
      </q-input>

      <custom-dropdown
        :model-value="props.filter.country"
        :options="countries"
        @update:model-value="(val) => updateField('country', val)"
        label="Country"
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
        :dark="isDarkMode ? true : false"
      />
    </div>
    <div v-if="isMobile" class="sorting-toggle-container">
      <span>Sort by name</span>
      <q-btn-toggle
        spread
        :model-value="props.filter.sortDir"
        @update:model-value="(val) => updateField('sortDir', val)"
        toggle-color="primary"
        color="white"
        text-color="primary"
        size="sm"
        class="sorting-toggle"
        :dark="isDarkMode ? true : false"
        :options="[
          { label: 'A-Z', value: 1 },
          { label: 'Z-A', value: -1 },
        ]"
      />
    </div>
    <q-btn
      color="primary"
      class="clear-button"
      @click="handleClear"
      icon="delete"
      :disable="_isDefault()"
      >Clear</q-btn
    >
  </fieldset>
</template>

<script setup>
import { defineProps, computed } from 'vue'

import { useSystemStore } from 'src/stores/system'
import { companiesService } from 'src/services/api/companies.service'
import { useScreen } from 'src/composables/useScreen'

import { checkboxFilters } from '../../config/company/filters'
import { countries } from '../../config/company/countries'

import CustomDropdown from '../custom/CustomDropdown.vue'

const props = defineProps(['filter'])
const emit = defineEmits(['update', 'clear', 'closeModal'])

const { isMobile } = useScreen()
const store = useSystemStore()
const isDarkMode = computed(() => store.isDarkMode)

function updateField(field, value) {
  const newFilter = {
    ...props.filter,
    [field]: props.filter[value] === value ? '' : value,
  }

  emit('update', newFilter)
}

function handleClear() {
  emit('clear')
}

function _isDefault() {
  return JSON.stringify(companiesService.getDefaultFilter()) === JSON.stringify(props.filter)
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

  &.dark-mode {
    background-color: $clr-surface-elevated;
    color: $clr-text-primary;

    border-color: $clr-border-light;

    legend {
      background-color: $clr-surface-elevated;
      color: $clr-text-primary;
    }
  }

  legend {
    font-weight: 600;
    font-size: 1.1rem;
    padding: 0 0.5rem;
    color: $clr-surface;
    border-radius: 5px 5px 0px;
  }

  @media (max-width: $break-narrow) {
    align-self: end;
    top: calc($header-height);
    font-size: 0.9rem;
    height: 400px;
    // height: calc(100vh - $header-height - 6rem);
    // position: relative;
    z-index: 200;
    margin-bottom: 0.5rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.253);
    display: grid;
    grid-template-columns: 1fr auto;

    .close-button {
      position: absolute;
      top: 2em;
      right: 1em;
    }

    legend {
      background-color: #f5f7fa;

      border-bottom: none;
      border-radius: 6px 6px 0 0;
    }

    .filter-inputs {
      grid-column: 1 / 2;
    }

    .sorting-toggle-container {
      grid-column: 1 / 2;
      grid-row: 1/2;

      display: flex;
      flex-direction: column;

      justify-content: center;

      span {
        align-self: center;
      }
    }
    .filter-checkboxes {
      grid-column: 1 / 2;
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
      gap: 0.5rem;
    }
  }

  .filter-checkboxes {
    display: flex;
    flex: 1 1 300px;
    flex-wrap: wrap;
    align-items: center;

    gap: 1.2rem;
  }

  .clear-button {
    align-self: end;
    justify-self: end;
  }
}
</style>
