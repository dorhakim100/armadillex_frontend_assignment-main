<template>
  <q-card class="card-container" :dark="isDarkMode">
    <q-card-section>
      <div class="text-h6">
        <span v-if="company.isEmpty">Add Company</span>
        <span v-else>Edit Company</span>
      </div>
    </q-card-section>

    <q-card-section
      v-for="field in companyFields.filter((f) => f.type !== 'checkbox')"
      :key="field.key"
      class="q-mb-sm input-container"
      :class="`${field.key} ${field.type}`"
    >
      <!-- Text or AI-enabled field -->
      <template v-if="field.type === 'text'">
        <q-input v-model="company[field.key]" :label="field.label" :dark="isDarkMode">
          <template v-if="field.aiSuggest" #append>
            <q-spinner v-if="isAiLoading" />
            <q-btn
              v-else
              dense
              flat
              icon="auto_fix_high"
              @click="onGenerateAiNames"
              :disable="isAiLoading"
            />
          </template>
        </q-input>

        <!-- AI suggestion radio options -->
        <transition name="expand-height">
          <div v-if="field.aiSuggest && suggestedNames.length > 0" class="ai-expand-wrapper">
            <!-- @CR: Typo in variable name - 'sudgestedNames' should be 'suggestedNames' -->
            <q-option-group
              v-model="company.name"
              type="radio"
              :options="suggestedNames.map((name) => ({ label: name, value: name }))"
              class="q-mt-sm checkbox-group ai-names-container"
              :dark="isDarkMode"
            />
          </div>
        </transition>
      </template>

      <!-- Select -->

      <custom-dropdown
        v-else-if="field.type === 'select'"
        :model-value="company[field.key] || ''"
        @update:model-value="(val) => (company[field.key] = val)"
        :label="field.label"
        :options="getSelectOptions(field.key)"
      />
      <!-- Date -->
      <date-picker
        v-else-if="field.type === 'date'"
        v-model="company[field.key]"
        :companyDate="company['dateAdded']"
      />
    </q-card-section>
    <!-- Checkbox -->

    <q-card-section class="q-mb-sm checkbox-group">
      <q-checkbox
        v-for="field in companyFields.filter((f) => f.type === 'checkbox')"
        v-model="company[field.key]"
        :label="field.label"
        :key="field.key"
      />
    </q-card-section>

    <q-card-actions align="around" class="actions-container">
      <q-btn
        v-if="!company.isEmpty"
        color="red"
        label="Delete"
        @click="onDeleteClick"
        align="left"
      />
      <div class="cancel-ok-container">
        <q-btn flat label="Cancel" @click="onCancelClick" />
        <q-btn color="primary" label="Save" @click="onSaveClick" />
      </div>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useSystemStore } from 'src/stores/system'

import { notifyService } from 'src/services/notify.service'
import { formatDate } from 'src/services/util.service'
import { useCompanyNames } from '../../composables/useCompanyNames'

import { companyFields } from '../../config/company/fields'
import { countries } from 'src/config/company/filters'

import DatePicker from './DatePicker.vue'
import CustomDropdown from '../custom/CustomDropdown.vue'

const props = defineProps({
  company: Object,
  companies: Array,
})

const emit = defineEmits(['save', 'delete', 'close'])

const $q = useQuasar()

const systemStore = useSystemStore()
const isDarkMode = computed(() => systemStore.isDarkMode)

const company = ref(props.company)
const companies = ref(props.companies)

const suggestedNames = ref([])
const isAiLoading = ref(false)

function onSaveClick() {
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

  emit('save', company.value)
}

function onCancelClick() {
  emit('close')
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
    emit('delete', company.value)
  })
}

async function onGenerateAiNames() {
  if (!company.value.name) {
    notifyService.error('Please enter a company name before generating AI names.')
    return
  }
  isAiLoading.value = true
  // Simulate an API call to generate AI names
  try {
    suggestedNames.value = await useCompanyNames(company.value.name)
  } catch (error) {
    console.error('Error generating AI names:', error)
  } finally {
    isAiLoading.value = false
  }
}

function getSelectOptions(key) {
  return key === 'parentName' ? companies.value.map((c) => c.name) : countries
}
</script>

<style scoped lang="scss">
@import 'src/css/setup/_variables.scss';
.card-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  padding: 0.8rem;

  max-height: 80vh;

  @media (max-width: $break-narrow) {
    grid-template-columns: 1fr;
    top: 10px;
  }
}

.input-container {
  align-items: center;

  &.text {
    grid-column: 1 / -1;
  }
  display: grid;

  &.name {
    gap: 1rem;
  }
}
.ai-names-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
  align-items: center;
  justify-items: start;

  @media (max-width: $break-narrow) {
    align-items: start;
  }
}

.expand-height-enter-active,
.expand-height-leave-active {
  transition:
    max-height 0.3s ease,
    opacity 0.3s ease;
  overflow: hidden;
}

.expand-height-enter-from,
.expand-height-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-height-enter-to,
.expand-height-leave-from {
  max-height: 300px;
  opacity: 1;
}

.actions-container {
  grid-column: 1/-1;

  .cancel-ok-container {
    justify-self: end;

    display: flex;
    gap: 0.5rem;
  }
}
</style>
