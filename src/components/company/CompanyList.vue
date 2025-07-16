<template>
  <div class="container">
    <company-table
      v-if="!isMobile"
      :companies="props.companies"
      @onEdit="handleEdit"
      @navigate="navigateToCompany"
    />
    <company-cards
      v-else
      :companies="companies"
      @onEdit="handleEdit"
      @navigate="navigateToCompany"
    />
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

import CompanyTable from './CompanyTable.vue'
import CompanyCards from './CompanyCards.vue'

import { breakpoints } from 'src/config/scss.variables'

const props = defineProps(['companies', 'filter'])
const emit = defineEmits(['update', 'onOpenEdit'])

const router = useRouter()

const $q = useQuasar()
const isMobile = computed(() => $q.screen.width < breakpoints.narrow)

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
