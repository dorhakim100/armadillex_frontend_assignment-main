<template>
  <q-layout view="lHh Lpr lFf">
    <app-header />
    <div v-if="isLoading && isMobile" class="loader-container">
      <q-circular-progress
        indeterminate
        rounded
        size="50px"
        class="loader"
        :color="isDarkMode ? 'amber-1' : 'primary'"
      />
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
import { computed, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSystemStore } from 'src/stores/system'
import { useGlobalLoading } from 'src/composables/useGlobalLoading'
import { useScreen } from 'src/composables/useScreen'
import { useAuth } from 'src/composables/useAuth'
import { ROUTES } from 'src/router/const'
import AppHeader from 'src/components/layout/AppHeader.vue'

const { isLoading } = useGlobalLoading()
const { isMobile } = useScreen()
const store = useSystemStore()

const isDarkMode = computed(() => store.isDarkMode)

// Global auth guard at layout level
const router = useRouter()
const route = useRoute()
const { user } = useAuth()

watchEffect(() => {
  const isOnLogin = route.name === ROUTES.LOGIN
  if (!user?.value && !isOnLogin) {
    router.replace({ name: ROUTES.LOGIN })
  }
})
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
      background-color: $clr-bg-dark-background;
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
