<template>
  <div class="table-container">
    <q-table title="Companies" :rows="companies" :columns="columns" row-key="id" flat bordered>
      <template #body-cell-active="props">
        <q-td :props="props" class="icon-container">
          <q-icon
            :name="props.row.active ? 'check_circle' : 'cancel'"
            :color="props.row.active ? 'positive' : 'negative'"
          />
        </q-td>
      </template>

      <template #body-cell-providesAiServices="props">
        <q-td :props="props" class="icon-container">
          <q-icon
            :name="props.row.providesAiServices ? 'smart_toy' : 'remove_circle_outline'"
            :color="props.row.providesAiServices ? 'primary' : 'grey'"
          />
        </q-td>
      </template>

      <template #body-cell-isDpfFound="props">
        <q-td :props="props" class="icon-container">
          <q-icon
            :name="props.row.isDpfFound ? 'find_in_page' : 'highlight_off'"
            :color="props.row.isDpfFound ? 'accent' : 'grey-6'"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

import { columns } from 'src/composables/useCompanyTableConfig'

const props = defineProps(['companies'])
</script>

<style scoped lang="scss">
.table-container {
  .icon-container {
    text-align: center;
  }
}
</style>
