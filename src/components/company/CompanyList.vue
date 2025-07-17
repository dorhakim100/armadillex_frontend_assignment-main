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
import { useSystemStore } from 'src/stores/system'

import CompanyTable from './CompanyTable.vue'
import CompanyCards from './CompanyCards.vue'

const props = defineProps(['companies', 'filter'])
const emit = defineEmits(['update', 'onOpenEdit'])

const router = useRouter()
const systemStore = useSystemStore()

const isMobile = computed(() => systemStore.isMobile)

function handleEdit(company) {
  emit('onOpenEdit', company)
}
function navigateToCompany(company) {
  router.push({ name: 'company-details', params: { id: company.id } })
}
</script>
<style scoped lang="scss"></style>
