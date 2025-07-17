<template>
  <div class="table-container">
    <q-table
      class="companies-table"
      :rows="companies"
      :columns="columns"
      row-key="id"
      flat
      bordered
      :dark="isDarkMode"
      @row-click="onNavigateToDetails"
      :body-row-class="() => 'clickable-row'"
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
        <q-td
          :props="props"
          class="icon-container group"
          @mouseenter="isHover = true"
          @mouseleave="isHover = false"
        >
          <!-- <q-btn
            @click="onNavigateToDetails(props.row)"
            flat
            round
            color="primary"
            icon="visibility"
          /> -->
          <q-btn @click="onEditCompany(props.row)" flat round color="primary" icon="edit" />
        </q-td>
      </template>
    </q-table>

    <inner-loading label="Loading companies..." />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref } from 'vue'
import { useSystemStore } from 'src/stores/system'

import { columns } from '../../config/company/table.config'
import { companyFieldIcons } from '../../config/company/boolean.icons'

import InnerLoading from '../common/InnerLoading.vue'

defineProps(['companies'])
const emit = defineEmits(['handleEdit', 'navigate'])

const store = useSystemStore()
const isDarkMode = computed(() => store.isDarkMode)
const isHover = ref(false)

function onEditCompany(company) {
  emit('onEdit', company)
}
function onNavigateToDetails(event, company) {
  if (isHover.value) return
  emit('navigate', company)
}
</script>

<style scoped lang="scss">
.table-container {
  min-height: 380px;
  .companies-table {
    ::v-deep th {
      font-weight: 600;
      font-size: 1.1rem;
    }
    td {
      font-size: 1.1rem;
    }
  }
  .icon-container {
    text-align: center;
    i {
      font-size: 1.6rem;
    }
    &.group {
      text-align: start;
    }
  }
}
</style>
