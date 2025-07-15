<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="min-width: 400px" class="card-container">
      <q-card-section>
        <div class="text-h6">
          <span v-if="company.isEmpty"> Add Company</span>
          <span v-else> Edit Company</span>
        </div>
      </q-card-section>

      <q-card-section
        v-for="field in companyFields.filter((f) => f.type !== 'checkbox')"
        :key="field.key"
        class="q-mb-sm input-container"
        :class="field.key"
      >
        <!-- Text or AI-enabled field -->
        <template v-if="field.type === 'text'">
          <q-input v-model="company[field.key]" :label="field.label">
            <template v-if="field.aiSuggest" #append>
              <q-spinner v-if="isLoadingAiNames" />
              <q-btn
                v-else
                dense
                flat
                icon="auto_fix_high"
                @click="onGenerateAiNames"
                :disable="isLoadingAiNames"
              />
            </template>
          </q-input>

          <!-- AI suggestion radio options -->
          <q-option-group
            v-if="field.aiSuggest && sudgestedNames.length > 0"
            v-model="company.name"
            type="radio"
            :options="sudgestedNames.map((name) => ({ label: name, value: name }))"
            class="q-mt-sm checkbox-group ai-names-container"
          />
        </template>

        <!-- Select -->
        <q-select
          v-else-if="field.type === 'select'"
          v-model="company[field.key]"
          :label="field.label"
          :options="getSelectOptions(field.key)"
          emit-value
          map-options
          use-input
          clearable
          popup-content-class="custom-select-dropdown"
          input-debounce="0"
          @filter="(val, update) => handleFilter(field.key, val, update)"
          @clear="() => handleClear(field.key)"
          :input-class="getCustomInputClass(field.key)"
        />

        <!-- Date -->
        <date-picker v-else-if="field.type === 'date'" v-model="company[field.key]" />
      </q-card-section>
      <!-- Checkbox -->

      <q-card-section class="q-mb-sm">
        <q-checkbox
          v-for="field in companyFields.filter((f) => f.type === 'checkbox')"
          v-model="company[field.key]"
          :label="field.label"
          :key="field.key"
          class="checkbox-group"
        />
      </q-card-section>

      <q-card-actions align="around">
        <q-btn
          v-if="!company.isEmpty"
          color="red"
          label="Delete"
          @click="onDeleteClick"
          align="left"
        />
        <div class="cancel-ok-container">
          <q-btn flat label="Cancel" @click="onDialogCancel" />
          <q-btn color="primary" label="Save" @click="onOKClick" />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'

import { notifyService } from 'src/services/notify.service'
import { formatDate } from 'src/services/util.service'
import { useCompanyNames } from '../../composables/useCompanyNames'

import { companyFields } from '../../config/company/fields'
import { countries } from 'src/config/company/filters'

import DatePicker from './FilterCmps/DatePicker.vue'

const props = defineProps({
  company: Object,
  companies: Array,
})

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
  'delete',
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const $q = useQuasar()

const company = ref({ ...props.company })
const companies = ref([...props.companies])
const companiesCopy = ref([...props.companies])
const countriesCopy = ref([...countries])

const isLoadingAiNames = ref(false)
const sudgestedNames = ref([])
const companiesFilterTxt = ref('')
const countriesFilterTxt = ref('')

const companiesNameId = computed(() => {
  return companiesCopy.value.map((c) => {
    {
      return {
        id: c.id,
        name: c.name,
      }
    }
  })
})

function onOKClick() {
  if (company.value.isEmpty) {
    delete company.value.isEmpty
    delete company.value.id
  }

  if (company.value.parentName) {
    const parent = companies.value.find((c) => c.name === company.value.parentName)
    const { id: parentId } = parent
    company.value.parentId = parentId
  }

  company.value.dateAdded = formatDate(company.value.dateAdded)

  onDialogOK({ action: 'save', company: company.value })
}

function onDeleteClick() {
  // Use Quasar's dialog for confirmation
  $q.dialog({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete "${company.value.name}"?`,
    ok: true,
    cancel: true,
    okLabel: 'Delete',
    persistent: true,
    color: 'negative',
  }).onOk(() => {
    onDialogOK({ action: 'delete', company: company.value })
  })
}
async function onGenerateAiNames() {
  if (!company.value.name) {
    notifyService.error('Please enter a company name before generating AI names.')
    return
  }
  isLoadingAiNames.value = true
  // Simulate an API call to generate AI names
  try {
    sudgestedNames.value = await useCompanyNames(company.value.name)
  } catch (error) {
    console.error('Error generating AI names:', error)
  } finally {
    isLoadingAiNames.value = false
  }
}

function handleFilter(key, val, update) {
  if (key === 'parentName') {
    filterSelectCompanies(val, update)
  } else {
    filterSelectCountries(val, update)
  }
}

function handleClear(key) {
  if (key === 'parentName') {
    companiesFilterTxt.value = ''
    companiesCopy.value = companies.value
  } else {
    countriesFilterTxt.value = ''
    countriesCopy.value = companies.value
  }
}

function getSelectOptions(key) {
  return key === 'parentName' ? companiesCopy.value.map((c) => c.name) : countriesCopy.value
}

function getCustomInputClass(key) {
  return key === 'country' ? 'text-uppercase' : ''
}

function filterSelectCompanies(val, update) {
  const regex = new RegExp(val, 'i')
  const filtered = companiesNameId.value.filter((c) => regex.test(c.name))

  update(() => {
    companiesFilterTxt.value = val
    companiesCopy.value = val ? filtered : companies.value
  })
}
function filterSelectCountries(val, update) {
  const regex = new RegExp(val, 'i')
  const filtered = countriesCopy.value.filter((c) => regex.test(c))

  console.log('Filtered countries:', filtered)

  update(() => {
    countriesFilterTxt.value = val
    countriesCopy.value = val ? filtered : countries
  })
}
</script>

<style scoped lang="scss">
.card-container {
  // display: grid;
  // gap: 0.5rem;
}

.input-container {
  display: grid;

  &.name {
    gap: 1rem;
  }
}
.ai-names-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.5rem;
}

.cancel-ok-container {
  justify-self: end;

  display: flex;
  gap: 0.5rem;
}
</style>
