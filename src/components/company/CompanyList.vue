<template>
  <div class="container">
    <company-table
      :companies="props.companies"
      @onEdit="handleEdit"
      @navigate="navigateToCompany"
    />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

import CompanyTable from './CompanyTable.vue'

const props = defineProps(['companies', 'filter'])
const emit = defineEmits(['update', 'onOpenEdit'])

const router = useRouter()

function handleEdit(company) {
  emit('onOpenEdit', company)
}
function navigateToCompany(company) {
  router.push({ name: 'company-details', params: { id: company.id } })
}
</script>
<style scoped lang="scss">
// .container {
// display: flex;
// flex-direction: column;
// align-items: center;
// justify-content: center;
// }
</style>
