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

const filter = ref(companiesService.getDefaultFilter())
const { companies } = useCompanies(filter.value)

// display users the parent company name, not id
const modifiedCompanies = computed(() => {
  const list = companies.value || []
  return list.map((company) => {
    const parent = list.find((c) => c.id === company.parentId)
    return {
      ...company,
      parent: parent ? { id: parent.id, name: parent.name } : null,
    }
  })
})

function updateFilter(newFilter) {
  filter.value = {
    ...filter.value,
    ...newFilter,
  }
}
</script>
