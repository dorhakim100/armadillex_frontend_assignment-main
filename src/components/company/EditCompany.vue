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
          :options="field.options"
          emit-value
          map-options
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
          class="checkbox-group"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" @click="onDialogCancel" />
        <q-btn color="primary" label="Save" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'

import { useCompanyNames } from '../../composables/useCompanyNames'

import { companyFields } from '../../composables/useCompanyFields'

import DatePicker from './FilterCmps/DatePicker.vue'
import { notifyService } from 'src/services/notify.service'

const props = defineProps({
  company: Object,
})

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const company = ref({ ...props.company })
const isLoadingAiNames = ref(false)
const sudgestedNames = ref([])

function onOKClick() {
  // on OK, it is REQUIRED to
  // call onDialogOK (with optional payload)
  onDialogOK(company.value)
  // or with no payload: onDialogOK()
  // ...and it will also hide the dialog automatically
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
</style>
