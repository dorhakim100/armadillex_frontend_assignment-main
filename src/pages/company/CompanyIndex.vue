<template>
  <q-card>
    <q-card-section>
      <h1>Companies</h1>
      <!-- <company-filter /> -->
    </q-card-section>
    <q-card-section>
      <q-spinner v-if="!companies" />
      <company-list v-else :companies="modifiedCompanies" />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onMounted, computed, watch } from 'vue'
import { useCompanies } from 'src/composables/useCompanies'

import CompanyList from 'src/components/company/CompanyList.vue'
// import CompanyFilter from 'src/components/company/CompanyFilter.vue'

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

const filter = computed(() => ({
  search: search.value.trim().toLowerCase(),
  country: country.value,
  onlyActive: true,
}))
</script>
