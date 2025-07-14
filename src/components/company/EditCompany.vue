<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="min-width: 400px" class="card-container">
      <q-card-section>
        <div class="text-h6">
          <span v-if="company.isEmpty"> Add Company</span>
          <span v-else> Edit Company</span>
        </div>
      </q-card-section>

      <q-card-section v-for="field in companyFields" :key="field.key" class="q-mb-sm">
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

        <!-- Checkbox -->
        <q-checkbox
          v-else-if="field.type === 'checkbox'"
          v-model="company[field.key]"
          :label="field.label"
          class="checkbox-group"
        />

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

import { companyFields } from '../../composables/useCompanyFields'

import DatePicker from './FilterCmps/DatePicker.vue'

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

function onGenerateAiNames() {
  isLoadingAiNames.value = true
  // Simulate an API call to generate AI names
  setTimeout(() => {
    sudgestedNames.value = [
      'Tech Innovators',
      'Global Solutions',
      'Future Enterprises',
      'Visionary Ventures',
    ]
    isLoadingAiNames.value = false
  }, 2000)
}
</script>

<style scoped lang="scss">
.card-container {
  // display: grid;
  // gap: 0.5rem;
}

.input-container {
  &.name {
    display: grid;
    gap: 1rem;
  }
}
.ai-names-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.5rem;
}
</style>
