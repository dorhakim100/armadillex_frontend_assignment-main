<template>
  <div class="table-container">
    <q-table
      class="companies-table"
      title="Companies"
      :rows="companies"
      :columns="columns"
      row-key="id"
      flat
      bordered
    >
      <template v-slot:[`body-cell-name`]="props">
        <q-td :props="props">
          <router-link
            :to="{ name: 'company-details', params: { id: props.row.id } }"
            class="text-primary text-weight-medium text-no-wrap"
            style="text-decoration: none"
          >
            {{ props.row.name }}
          </router-link>
        </q-td>
      </template>
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
        <q-td :props="props" class="icon-container group">
          <q-btn
            @click="onNavigateToDetails(props.row)"
            flat
            round
            color="primary"
            icon="visibility"
          />
          <q-btn @click="onEditCompany(props.row)" flat round color="primary" icon="edit" />
        </q-td>
      </template>
    </q-table>
    <q-inner-loading
      :showing="isLoading"
      label="Loading companies..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
      class="custom-inner-loading"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

import { useCompanies } from 'src/composables/useCompanies'

import { columns } from '../../config/company/table.config'
import { companyFieldIcons } from '../../config/company/boolean.icons'

const props = defineProps(['companies'])
const emit = defineEmits(['handleEdit', 'navigate'])

const { isLoading } = useCompanies()

function onEditCompany(company) {
  emit('onEdit', company)
}
function onNavigateToDetails(company) {
  emit('navigate', company)
}
</script>

<style scoped lang="scss">
.table-container {
  min-height: 450px;
  .icon-container {
    text-align: center;
  }

  .custom-inner-loading {
    background-color: rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(2px);
    // border-radius: 8px;
  }
}
</style>
