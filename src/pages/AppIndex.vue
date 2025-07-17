<template>
  <q-layout view="lHh Lpr lFf">
    <app-header />
    <div v-if="isLoading && isMobile" class="loader-container">
      <q-circular-progress indeterminate rounded size="50px" class="loader" />
    </div>
    <q-page-container
      class="page-container"
      :class="[isDarkMode ? 'dark-mode' : '', isMobile ? 'mobile' : '']"
      style="padding-top: 0"
    >
      <q-page class="q-pa-md">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue'
import { useSystemStore } from 'src/stores/system'

import AppHeader from 'src/components/layout/AppHeader.vue'

const store = useSystemStore()
const isLoading = computed(() => store.isLoading)
const isMobile = computed(() => store.isMobile)
const isDarkMode = computed(() => store.isDarkMode)
</script>

<style lang="scss">
@import '/src/css/setup/variables.scss';

.page-container {
  min-height: 100vh;
  max-width: $max-width-screen;
  margin: auto;
  padding-top: $header-height !important;

  &.dark-mode {
    background-color: $clr-surface;
    color: $clr-text-primary;

    .q-page {
      background-color: $clr-surface;
      color: $clr-text-primary;
    }
  }

  .q-page {
    max-width: $max-width-screen;
  }
}
.loader-container {
  position: fixed;
  bottom: 1em;
  left: 1em;
  z-index: 1000;

  .loader {
    width: 70px;
    height: 70px;
    color: $clr-primary;
  }
}
</style>
