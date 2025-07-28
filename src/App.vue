<template>
  <router-view />
</template>

<script setup>
import { onMounted, computed, watch } from 'vue'
import { useSystemStore } from 'src/stores/system'
import { notifyMsgs, notifyService } from './services/notify.service'

const systemStore = useSystemStore()
const isDarkMode = computed(() => systemStore.isDarkMode)

onMounted(() => {
  notifyService.success(notifyMsgs.loginSuccess)

  _toggleDarkMode(systemStore.isDarkMode)
})

watch(isDarkMode, (newValue) => {
  _toggleDarkMode(newValue)
})

function _toggleDarkMode(stateToSet) {
  if (stateToSet) {
    document.querySelector('body').classList.add('dark-mode')
  } else {
    document.querySelector('body').classList.remove('dark-mode')
  }
}
</script>
