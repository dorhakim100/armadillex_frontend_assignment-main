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
  >
    <template #option="scope">
      <slot name="option" v-bind="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section v-if="scope.opt.avatar" avatar>
            <q-avatar v-if="scope.opt.avatar" size="28px">
              <img :src="scope.opt.avatar" alt="" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">{{ scope.opt.title }}</q-item-label>
            <q-item-label caption>{{ scope.opt.subtitle }}</q-item-label>
          </q-item-section>
        </q-item>
      </slot>
    </template>

    <template #selected-item="scope">
      <slot name="selected-item" v-bind="scope">
        <div class="row items-center no-wrap">
          <q-avatar v-if="scope.opt.avatar" size="16px" class="q-mr-sm">
            <img :src="scope.opt.avatar" alt="" />
          </q-avatar>
          <span>{{ scope.opt.title }}</span>
        </div>
      </slot>
    </template>
  </q-select>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useSystemStore } from 'src/stores/system'

const store = useSystemStore()

const isDarkMode = computed(() => store.isDarkMode)

const props = defineProps({
  modelValue: {
    type: [String, Number, Object],
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
  const lowVal = val.toLowerCase()

  const regex = new RegExp(lowVal, 'i')

  const filtered = props.options.filter((o) => {
    const lowTitle = o.title?.toLowerCase()
    const lowSubtitle = o.subtitle?.toLowerCase()

    if (lowVal === '') return true

    if (lowTitle === lowVal || lowSubtitle === lowVal) return true

    return regex.test(lowTitle) || regex.test(lowSubtitle)
  })

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
