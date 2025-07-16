<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useSystemStore } from 'src/stores/system'
import { notifyMsgs, notifyService } from './services/notify.service'

const systemStore = useSystemStore()

onMounted(() => {
  notifyService.success(notifyMsgs.loginSuccess)
  systemStore.initializeScreenWatcher()
})
</script>
