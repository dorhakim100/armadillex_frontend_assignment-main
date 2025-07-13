<template>
  <div class="table-container">
    <q-table title="Companies" :rows="companies" :columns="columns" row-key="id" flat bordered>
      <template
        v-for="iconField in companyFieldIcons"
        :key="iconField.field"
        v-slot:[`body-cell-${iconField.field}`]="props"
      >
        <q-td :props="props" class="icon-container">
          <q-icon
            :name="props.row[iconField.field] ? iconField.trueIcon.name : iconField.falseIcon.name"
            :color="
              props.row[iconField.field] ? iconField.trueIcon.color : iconField.falseIcon.color
            "
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

import { columns } from 'src/composables/useCompanyTableConfig'
import { companyFieldIcons } from '../../composables/useCompanyFieldIcons'

const props = defineProps(['companies'])
</script>

<style scoped lang="scss">
.table-container {
  .icon-container {
    text-align: center;
  }
}
</style>
