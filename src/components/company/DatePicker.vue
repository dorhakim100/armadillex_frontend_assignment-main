<template>
  <div class="container">
    <q-input filled v-model="displayDate" type="text" mask="##/##/####" readonly :dark="isDarkMode">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale" anchor="top left">
            <q-date v-model="internalDate" @update:model-value="updateDate">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import { useSystemStore } from 'src/stores/system'
import {
  formatUtcToDisplayDate,
  convertToQuasarDateFormat,
  convertFromQuasarDateFormat,
} from 'src/services/util.service'

const props = defineProps({
  modelValue: String, // ISO date string from parent
  companyDate: String, // backup prop (can be removed if not needed)
})

const emit = defineEmits(['update:modelValue'])
const store = useSystemStore()

const isDarkMode = computed(() => store.isDarkMode)

// Computed properties for reactive date handling
const displayDate = computed(() => {
  const dateToUse = props.modelValue || props.companyDate
  return formatUtcToDisplayDate(dateToUse)
})

const internalDate = computed({
  get() {
    const dateToUse = props.modelValue || props.companyDate
    return convertToQuasarDateFormat(dateToUse)
  },
  set(newQuasarDate) {
    const isoDate = convertFromQuasarDateFormat(newQuasarDate)
    emit('update:modelValue', isoDate)
  },
})

function updateDate(newVal) {
  const isoDate = convertFromQuasarDateFormat(newVal)
  emit('update:modelValue', isoDate)
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;

  label {
    padding: 0px;
  }
}
</style>
