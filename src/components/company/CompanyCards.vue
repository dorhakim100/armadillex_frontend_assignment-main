<template>
  <div class="cards-container q-gutter-md row">
    <q-card
      v-for="company in companies"
      :key="company.id"
      class="company-card"
      :dark="isDarkMode"
      @click="handleNavigation(company)"
    >
      <q-card-section class="text-h6 text-primary">
        <router-link
          :to="{ name: 'company-details', params: { id: company.id } }"
          class="text-primary"
        >
          {{ company.name }}
        </router-link>
      </q-card-section>

      <q-card-section class="icon-container">
        <div
          v-for="iconField in companyFieldIcons"
          :key="iconField.field"
          class="icon-wrapper text-center"
        >
          <q-icon
            :name="company[iconField.field] ? iconField.trueIcon.name : iconField.falseIcon.name"
            :color="company[iconField.field] ? iconField.trueIcon.color : iconField.falseIcon.color"
            size="md"
          />
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn icon="visibility" flat round color="primary" @click="handleNavigation(company)" />
        <q-btn
          icon="edit"
          flat
          round
          color="primary"
          @click="() => emit('onEdit', company)"
          @mouseenter="isHover = true"
          @mouseleave="isHover = false"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref } from 'vue'
import { useSystemStore } from 'src/stores/system'
import { companyFieldIcons } from 'src/config/company/boolean.icons'

defineProps(['companies'])
const emit = defineEmits(['onEdit', 'navigate'])

const store = useSystemStore()
const isDarkMode = computed(() => store.isDarkMode)
const isHover = ref(false)

function handleNavigation(company) {
  if (isHover.value) return
  emit('navigate', company)
}
</script>

<style scoped lang="scss">
@import 'src/css/setup/_variables.scss';
.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
}
.company-card {
  width: 100%;
  cursor: pointer;
  transition: 0.2s ease-out;

  &:hover {
    // box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }

  &.q-dark {
    background-color: var(--q-dark-bg);
    color: var(--q-dark-text);
  }

  @media (min-width: 600px) {
    width: calc(50% - 1rem);
  }

  @media (min-width: 1024px) {
    width: calc(33.333% - 1rem);
  }
}
.icon-container {
  display: flex;

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
