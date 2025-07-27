<template>
  <q-card :dark="isDarkMode" class="main-container" :class="[isDarkMode ? 'dark-mode' : '']">
    <q-card-section>
      <h1>Companies</h1>
      <div class="interface-container">
        <div class="desktop-container" v-if="!isMobile">
          <company-filter :filter="filter" @update="updateFilter" @clear="clearFilter" />
          <q-btn color="primary" label="Add" icon="add" @click="handleOnAddClick" />
        </div>
        <div v-else class="mobile-container">
          <!-- Filter modal -->
          <q-dialog v-model="showFilterModal" position="left" style="width: 300px !important">
            <q-card class="filter-dialog-content" :dark="isDarkMode">
              <company-filter :filter="filter" @update="updateFilter" @clear="clearFilter" />
            </q-card>
          </q-dialog>
        </div>
      </div>
    </q-card-section>
    <div class="mobile-buttons" :class="[isDarkMode ? 'dark-mode' : '']" v-if="isMobile">
      <q-btn label="Filter" color="primary" icon="filter_list" @click="showModal = true" />
      <q-btn color="primary" label="Add" icon="add" @click="handleOnAddClick" />
    </div>
    <q-card-section>
      <company-list :companies="slicedCompanies" @onOpenEdit="onOpenEdit" />
      <q-pagination v-if="isMobile" v-model="pageNumber" :max="maxPage" input class="pagination" />
    </q-card-section>
  </q-card>

  <!-- Edit modal -->
  <q-dialog v-model="showEditModal" style="width: 300px !important">
    <company-edit
      :company="companyToEdit"
      :companies="companies"
      @close="handleCloseEditModal"
      @save="onSaveClick"
      @delete="onDeleteClick"
      :show="showEditModal"
    />
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

import { companiesService } from '../../services/api/companies.service'
import { useCompanies } from 'src/composables/useCompanies'

import { useSystemStore } from 'src/stores/system'

import CompanyList from 'src/components/company/CompanyList.vue'
import CompanyFilter from 'src/components/company/CompanyFilter.vue'
import CompanyEdit from 'src/components/company/CompanyEdit.vue'

const { companies, saveCompany, deleteCompany } = useCompanies()
const companiesCopy = ref([])

const filter = ref(companiesService.getDefaultFilter())
const showFilterModal = ref(false)

const companyToEdit = ref(null)
const showEditModal = ref(false)

const store = useSystemStore()

const isMobile = computed(() => store.isMobile)
const isDarkMode = computed(() => store.isDarkMode)

const PAGE_SIZE = 3
const pageIdx = ref(0)

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

const companiesWithParent = computed(() => {
  return filteredCompanies.value.map((company) => {
    const parent = filteredCompanies.value.find((c) => c.id === company.parentId)
    return {
      ...company,
      parent: parent ? { id: parent.id, name: parent.name } : null,
    }
  })
})

// modify for pagination
const slicedCompanies = computed(() => {
  if (!isMobile.value) return companiesWithParent.value

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

watch(
  filter,
  () => {
    pageIdx.value = 0
  },
  { deep: true },
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
  companyToEdit.value = company
  showEditModal.value = true
}

async function onSaveClick(company) {
  try {
    handleCloseEditModal()
    await saveCompany(company)
  } catch (err) {
    console.log('Save failed:', err)
  }
}

async function onDeleteClick(company) {
  try {
    handleCloseEditModal()
    await deleteCompany(company.id)
  } catch (err) {
    console.log('Delete failed:', err)
  }
}

function handleCloseEditModal() {
  showEditModal.value = false
  companyToEdit.value = null
}

function handleOnAddClick() {
  console.log('handleOnAddClick')
  companyToEdit.value = companiesService.getEmptyCompany()
  showEditModal.value = true
}
</script>

<style scoped lang="scss">
@import 'src/css/setup/_variables.scss';

.main-container {
  &.dark-mode {
    background-color: $clr-surface !important;
  }
}
h1 {
  font-size: 3.5rem;
  font-weight: 600;
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
      width: 60px;
      height: 60px;
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
  // position: relative;
}
.mobile-buttons {
  position: sticky;
  z-index: 100;
  top: calc($header-height + 1rem);
  top: calc($header-height);

  width: calc(100% - 3.4em);

  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  justify-self: center;
  border-bottom: 1px solid $clr-border;

  height: 100%;
  background-color: $clr-accent-table;
  padding: 10px 5px;

  &.dark-mode {
    background-color: $clr-surface;
  }

  button {
    box-shadow:
      rgba(0, 0, 0, 0.16) 0px 3px 6px,
      rgba(0, 0, 0, 0.23) 0px 3px 6px;
  }

  border-radius: 3px !important;
}

.filter-dialog-content {
  min-height: 200px;

  width: 90vw;
  max-width: 600px;

  left: 0;
  right: 0;
  padding: 10px;
  &.q-dark {
    background-color: $clr-bg-dark-background !important;
  }
}

.pagination {
  justify-self: end;
}
</style>
