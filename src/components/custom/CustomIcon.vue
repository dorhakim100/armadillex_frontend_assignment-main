<template>
  <div class="icon-wrapper">
    <q-icon :name="icon.name" :color="icon.color" :size="isMobile ? '' : 'xl'">
      <!-- <q-tooltip v-if="!isMobile">{{ capitalizeFirstLetter(icon.field) }}</q-tooltip> -->
    </q-icon>
    <span>{{ capitalizeFirstLetter(icon.field) }}</span>
  </div>
  <q-separator vertical v-if="props.isSeparator" />
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { useSystemStore } from 'src/stores/system'
import { capitalizeFirstLetter } from 'src/services/util.service'

const store = useSystemStore()

const isMobile = computed(() => store.isMobile)

const props = defineProps({
  icon: {
    type: Object,
    required: true,
  },
  isSeparator: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
.icon-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-around;
  // justify-content: space-between;
  text-align: center;
  gap: 0.5rem;

  i {
    align-self: center;
    font-size: 1.5rem;
  }

  span {
    font-size: 0.8rem;
  }
}
</style>
