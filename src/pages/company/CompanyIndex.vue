<template>
  <q-card>
    <q-card-section>
      <h2>Companies</h2>
      <div class="interface-container">
        <company-filter :filter="filter" @update="updateFilter" />
        <q-btn color="primary" label="Add Company" @click="onOpenModal" />
      </div>
    </q-card-section>
    <q-card-section>
      <company-list :companies="modifiedCompanies" @onOpenEdit="onOpenEdit" />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'

import { companiesService } from '../../services/api/companies.service'
import { useCompanies } from 'src/composables/useCompanies'

import { useSystemStore } from 'src/stores/system'

import CompanyList from 'src/components/company/CompanyList.vue'
import CompanyFilter from 'src/components/company/CompanyFilter.vue'
import EditCompany from 'src/components/company/EditCompany.vue'

const { companies, saveCompany, deleteCompany } = useCompanies()
const companiesCopy = ref([])

const filter = ref(companiesService.getDefaultFilter())

const $q = useQuasar()

const store = useSystemStore()

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

watch(
  companies,
  (newVal) => {
    if (newVal) {
      companiesCopy.value = [...newVal]
    }
  },
  { immediate: true },
)

function updateFilter(newFilter) {
  filter.value = {
    ...filter.value,
    ...newFilter,
  }
}

function onOpenEdit(company) {
  onOpenModal(null, company)
}

function onOpenModal(_, companyToEdit = companiesService.getEmptyCompany()) {
  // first parameter is event, not used
  $q.dialog({
    component: EditCompany,
    componentProps: {
      company: companyToEdit,
      companies: companies.value,
    },
  })
    .onOk(async (clickEvent) => {
      const { action, company: editedCompany } = clickEvent

      if (action === 'delete') {
        try {
          await deleteCompany(editedCompany.id)
        } catch (err) {
          console.error('Delete failed:', err)
        }
      } else {
        try {
          await saveCompany(editedCompany)
        } catch (err) {
          console.error('Save failed:', err)
        }
      }
    })

    .onCancel(() => {
      // console.log('Dialog cancelled')
    })
}
</script>

<style scoped lang="scss">
h2 {
  // font-size: 1.6rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}
.interface-container {
  display: grid;

  gap: 1rem;

  button {
    justify-self: start;
  }
}
</style>
