<template>
  <q-dialog v-model="settingsModal">
    <q-card class="modal-container">
      <q-card-section class="text-h6">Settings</q-card-section>
      <q-card-section>
        <q-toggle v-model="isDarkMode" label="Dark Mode" @update:model-value="toggleDarkMode" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Close" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { useSystemStore } from 'src/stores/system'

const store = useSystemStore()

const isDarkMode = computed(() => store.isDarkMode)
const prefs = computed(() => store.prefs)

function toggleDarkMode() {
  const stateToSet = !isDarkMode.value

  const prefsToSet = {
    ...prefs.value,
    isDarkMode: stateToSet,
  }

  store.setPrefs(prefsToSet)
}
</script>

<style lang="scss">
@import 'src/css/setup/_variables.scss';
.modal-container {
  width: 90%;
  max-width: 300px;
}
</style>
