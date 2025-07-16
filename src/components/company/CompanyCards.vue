<template>
  <div class="cards-container q-gutter-md row">
    <q-card v-for="company in companies" :key="company.id" class="company-card">
      <q-card-section class="text-h6 text-primary">
        <router-link
          :to="{ name: 'company-details', params: { id: company.id } }"
          class="text-primary"
          style="text-decoration: none"
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
        <q-btn
          icon="visibility"
          flat
          round
          color="primary"
          @click="() => emit('navigate', company)"
        />
        <q-btn icon="edit" flat round color="primary" @click="() => emit('onEdit', company)" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { companyFieldIcons } from 'src/config/company/boolean.icons'

const props = defineProps(['companies'])
const emit = defineEmits(['onEdit', 'navigate'])
</script>

<style scoped lang="scss">
.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
}
.company-card {
  width: 100%;

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
