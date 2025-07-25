<template>
  <q-dialog>
    <q-card class="modal-container" :dark="isDarkMode">
      <q-card-section class="text-h6">Settings</q-card-section>
      <q-card-section>
        <q-toggle v-model="isDarkMode" label="Dark Mode" :dark="isDarkMode" />
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

// Writable computed - handles both get and set
const isDarkMode = computed({
  get: () => store.isDarkMode,
  set: (value) => store.setPrefs({ ...store.prefs, isDarkMode: value }),
})
</script>

<style lang="scss">
@import 'src/css/setup/_variables.scss';
.modal-container {
  width: 90%;
  max-width: 300px;
}
</style>
