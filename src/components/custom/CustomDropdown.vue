<template>
  <q-select
    v-model="modelValue"
    :options="options"
    :label="props.label"
    @filter="(val, update) => filteredOptions(val, update)"
    emit-value
    map-options
    use-input
    clearable
    popup-content-class="custom-select-dropdown"
    input-debounce="0"
    :dark="isDarkMode"
    :class="modelValue ? 'has-value' : ''"
    @clear="() => handleClear()"
  />
</template>

<script setup>
import { computed, ref } from 'vue'
import { useSystemStore } from 'src/stores/system'

const store = useSystemStore()

const isDarkMode = computed(() => store.isDarkMode)

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

// Writable computed for v-model support
const modelValue = computed({
  get: () => props.modelValue,
  set: (newValue) => emit('update:modelValue', newValue),
})

const options = ref(props.options)
const filterTxt = ref('')

function filteredOptions(val, update) {
  const regex = new RegExp(val, 'i')

  const filtered = props.options.filter((o) => regex.test(o))

  update(() => {
    filterTxt.value = val
    options.value = val ? filtered : props.options
  })
}

function handleClear() {
  // reset the value to empty string
  modelValue.value = ''
}
</script>

<style lang="scss" scoped>
:deep(.q-placeholder) {
  padding: 0 !important;
}
.has-value {
  :deep(.q-field__native) {
    .q-field__input {
      display: none !important;
    }
  }
}
</style>
