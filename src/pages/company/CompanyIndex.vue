<template>
  <q-card>
    <q-card-section>
      <h1>Companies</h1>
      <div class="interface-container">
        <div class="desktop-container" v-if="!isMobile">
          <company-filter :filter="filter" @update="updateFilter" @clear="clearFilter" />
          <q-btn color="primary" label="Add Company" icon="add" @click="onOpenModal" />
        </div>
        <div v-else class="mobile-container">
          <q-pagination v-model="pageNumber" :max="maxPage" input />

          <q-fab
            color="primary"
            class="floating-button shadow-12"
            icon="keyboard_arrow_left"
            direction="down"
          >
            <company-filter :filter="filter" @update="updateFilter" @clear="clearFilter" />
            <q-fab-action color="primary" icon="add" @click="onOpenModal" class="shadow-12" />
          </q-fab>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <company-list :companies="slicedCompanies" @onOpenEdit="onOpenEdit" />
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

const isMobile = computed(() => store.isMobile)

const PAGE_SIZE = 3
const pageIdx = ref(0)

watch(
  filter,
  () => {
    pageIdx.value = 0
  },
  { deep: true },
)

const pageNumber = computed({
  get: () => pageIdx.value + 1,
  set: (val) => {
    if (val < 1) return
    pageIdx.value = val - 1
  },
})

const filteredCompanies = computed(() => {
  let list = companiesCopy.value
  const { txt, country, onlyActive, onlyAI, onlyDPF, sortDir } = filter.value

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

  if (sortDir && isMobile.value) {
    list =
      sortDir === 1
        ? list.sort((a, b) => a.name.localeCompare(b.name))
        : list.sort((a, b) => b.name.localeCompare(a.name))
  }

  return list
})
const companiesLength = computed(() => filteredCompanies.value.length)
const maxPage = computed(() => Math.ceil(companiesLength.value / PAGE_SIZE))

// modify for pagination
const slicedCompanies = computed(() => {
  // adding parent company information
  const companiesWithParent = filteredCompanies.value.map((company) => {
    const parent = filteredCompanies.value.find((c) => c.id === company.parentId)
    return {
      ...company,
      parent: parent ? { id: parent.id, name: parent.name } : null,
    }
  })

  if (!isMobile.value) return companiesWithParent

  const start = pageIdx.value * PAGE_SIZE
  const end = start + PAGE_SIZE
  return companiesWithParent.value.slice(start, end)
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

function clearFilter() {
  companiesCopy.value = [...companies.value]
  filter.value = companiesService.getDefaultFilter()
  pageIdx.value = 0
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
@import 'src/css/setup/_variables.scss';
h1 {
  font-size: 3.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
  transition: 0.2s ease-out;

  @media (max-width: $break-narrow) {
    font-size: 2.5rem;
  }
}
.interface-container {
  display: grid;
  gap: 1rem;
  position: relative;

  .floating-button {
    position: fixed;
    top: calc($header-height + 1em);
    right: 1em;
    margin: 1rem;

    button {
      // width: 100%;
      // height: 100%;
      width: 60px;
      height: 60px;
      // font-size: 1.2rem;
    }

    a {
      align-self: end;
      width: 55px;
      height: 55px;
    }
  }

  button {
    justify-self: start;
  }
}
</style>
