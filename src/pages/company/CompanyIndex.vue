<template>
  <q-card>
    <q-card-section>
      <h1>Companies</h1>
      <company-filter :filter="filter" @update="updateFilter" />
    </q-card-section>
    <q-card-section>
      <q-spinner v-if="!companies" />
      <company-list v-else :companies="modifiedCompanies" />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useCompanies } from 'src/composables/useCompanies'
import { companiesService } from '../../services/api/companies.service'

import CompanyList from 'src/components/company/CompanyList.vue'
import CompanyFilter from 'src/components/company/CompanyFilter.vue'
import { is } from 'quasar'

const { companies } = useCompanies()
const modifiedCompanies = computed(() => {
  return companies.value.map((company) => {
    const parentCompany = companies.value.find((c) => c.id === company.parentId)
    return {
      ...company,
      parent: parentCompany ? { id: company.parentId, name: parentCompany.name } : null,
    }
  })
})

const filter = ref(companiesService.getDefaultFilter())

watch(
  [filter],
  () => {
    // Trigger any side effects or API calls when filter changes
    console.log('Filter changed:', filter.value)
  },
  { deep: true },
)

function updateFilter(newFilter) {
  filter.value = {
    ...filter.value,
    ...newFilter,
  }
}
</script>
