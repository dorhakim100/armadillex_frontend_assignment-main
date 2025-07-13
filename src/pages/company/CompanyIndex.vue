<template>
  <q-card>
    <q-card-section>
      <h1>Companies</h1>
    </q-card-section>
    <q-card-section>
      <q-spinner v-if="!companies" />
      <company-list v-else :companies="companies" />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCompanies } from 'src/composables/useCompanies'

import CompanyList from 'src/components/company/CompanyList.vue'

const { companies } = useCompanies()
</script>
