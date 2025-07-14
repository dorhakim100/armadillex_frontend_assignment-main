<template>
  <q-card>
    <q-card-section>
      <h1>Companies</h1>
      <div class="interface-container">
        <company-filter :filter="filter" @update="updateFilter" />
        <!-- <edit-company /> -->
        <q-btn color="primary" label="Add Company" @click="onOpenModal" :loading="isSaving" />
      </div>
    </q-card-section>
    <q-card-section>
      <q-spinner v-if="!companies" />
      <company-list v-else :companies="modifiedCompanies" @onOpenEdit="onOpenEdit" />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCompanies } from 'src/composables/useCompanies'
import { companiesService } from '../../services/api/companies.service'

import CompanyList from 'src/components/company/CompanyList.vue'
import CompanyFilter from 'src/components/company/CompanyFilter.vue'
import EditCompany from 'src/components/company/EditCompany.vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

function onOpenEdit(company) {
  onOpenModal(null, company)
}

function onOpenModal(_, companyToEdit = companiesService.getEmptyCompany()) {
  $q.dialog({
    component: EditCompany,
    componentProps: {
      company: companyToEdit,
      companies: companies.value,
    },
  }).onOk((editedCompany) => {
    console.log('Edited Company:', editedCompany)
    saveCompany(editedCompany)
  })
}
const filter = ref(companiesService.getDefaultFilter())
const { companies, saveCompany, isSaving } = useCompanies()
const companiesCopy = ref([])

// Update the raw copy ONLY when the async data arrives
watch(
  companies,
  (newVal) => {
    if (newVal) {
      companiesCopy.value = [...newVal]
    }
  },
  { immediate: true },
)

const filteredCompanies = computed(() => {
  let list = companiesCopy.value
  const { txt, country, onlyActive, onlyAI, onlyDPF } = filter.value

  if (txt) {
    const regex = new RegExp(txt, 'i')
    list = list.filter((company) => regex.test(company.name) || regex.test(company.legalName))
  }

  if (country) {
    list = list.filter((company) => company.country === country)
  }
  if (onlyActive) {
    list = list.filter((company) => company.active)
  }
  if (onlyAI) {
    list = list.filter((company) => company.providesAiServices)
  }
  if (onlyDPF) {
    list = list.filter((company) => company.isDpfFound)
  }

  return list
})

// modify to show parent information
const modifiedCompanies = computed(() => {
  return filteredCompanies.value.map((company) => {
    const parent = filteredCompanies.value.find((c) => c.id === company.parentId)
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

<style scoped lang="scss">
.interface-container {
  display: grid;

  gap: 1rem;

  button {
    justify-self: start;
  }
}
</style>
