<template>
  <div class="container">
    <custom-table
      :rows="props.companies"
      :columns="columns"
      :iconFields="companyFieldIcons"
      :showActions="true"
      @row-click="navigateToCompany"
    >
      <template v-slot:[`body-cell-edit`]="props">
        <q-td :props="props" class="icon-container group">
          <slot name="actions" :row="props.row">
            <q-btn
              @click="
                (event) => {
                  event.stopPropagation()
                  handleEdit(props.row)
                }
              "
              flat
              round
              color="primary"
              icon="edit"
            />
          </slot>
        </q-td>
      </template>
    </custom-table>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

import { companyFieldIcons } from 'src/config/company/boolean.icons'
import { columns } from 'src/config/company/table.config'

import CustomTable from 'src/components/custom/CustomTable.vue'

const props = defineProps(['companies', 'filter'])
const emit = defineEmits(['update', 'onOpenEdit'])

const router = useRouter()

function handleEdit(company) {
  emit('onOpenEdit', company)
}
function navigateToCompany(company) {
  console.log(company)

  router.push({ name: 'company-details', params: { id: company.id } })
}
</script>
<style scoped lang="scss"></style>
