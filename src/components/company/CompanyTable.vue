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
      <template v-slot:[`body-cell-edit`]="props">
        <q-td :props="props" class="icon-container">
          <q-btn @click="onEditCompany(props.row)" flat round color="primary" icon="edit" />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

import { columns } from 'src/composables/useCompanyTableConfig'
import { companyFieldIcons } from '../../composables/useCompanyFieldIcons'

const props = defineProps(['companies'])
const emit = defineEmits(['handleEdit'])

function onEditCompany(company) {
  emit('onEdit', company)
}
</script>

<style scoped lang="scss">
.table-container {
  .icon-container {
    text-align: center;
  }
}
</style>
