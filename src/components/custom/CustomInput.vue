<template>
  <q-input
    :model-value="modelValue"
    @update:model-value="updateModelValue"
    :label="props.label"
    :type="props.type === 'password' ? (showPassword ? 'text' : 'password') : type"
    :rules="props.rules"
    outlined
    :dark="isDarkMode"
    autocomplete="email"
    class="form-field"
  >
    <template v-slot:prepend>
      <q-icon :name="props.icon" />
    </template>
    <template v-slot:append v-if="props.type === 'password'">
      <q-icon
        :name="showPassword ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        @click="showPassword = !showPassword"
      />
    </template>
  </q-input>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue'
import { useSystemStore } from 'src/stores/system'

const store = useSystemStore()
const isDarkMode = computed(() => store.isDarkMode)

const showPassword = ref(false)

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  rules: {
    type: Array,
    required: false,
  },
  icon: {
    type: String,
    required: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const updateModelValue = (value) => {
  emit('update:modelValue', value)
}
</script>
