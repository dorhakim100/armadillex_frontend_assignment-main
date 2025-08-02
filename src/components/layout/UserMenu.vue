<template>
  <div class="user-menu">
    <q-btn round outline :color="_getButtonColor()" class="user-avatar-btn">
      <q-avatar size="32px" :dark="isDarkMode">
        <q-icon name="person" size="24px" :color="_getButtonColor()" />
      </q-avatar>

      <q-menu
        v-model="menuOpen"
        transition-show="jump-down"
        transition-hide="jump-up"
        :offset="[0, 5]"
        class="user-menu-dropdown"
        :class="[isDarkMode ? 'dark-mode' : '']"
        :dark="isDarkMode"
      >
        <q-list style="min-width: 200px" class="light-bordered light-radius">
          <q-item-label v-if="!!user" header class="text-primary text-font-light">
            Hello,
            <span class="text-font-medium">{{ user.fullname }}</span>
          </q-item-label>

          <q-separator />

          <q-item clickable v-ripple v-if="!!user">
            <q-item-section avatar>
              <q-icon name="account_circle" color="secondary" />
            </q-item-section>
            <q-item-section>Profile</q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="onOpenSettingsModal">
            <q-item-section avatar>
              <q-icon name="settings" color="secondary" />
            </q-item-section>
            <q-item-section>Settings</q-item-section>
          </q-item>

          <q-separator />

          <q-item v-if="!!user" clickable v-ripple @click="onLogout">
            <q-item-section avatar>
              <q-icon name="logout" color="negative" />
            </q-item-section>
            <q-item-section class="text-negative">Logout</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { log } from 'src/services/log.service'
import { notifyMsgs, notifyService } from 'src/services/notify.service'
import { useAuth } from 'src/composables/useAuth'

import { useQuasar } from 'quasar'
import { useSystemStore } from 'src/stores/system'
import SettingsModal from './SettingsModal.vue'
import { ROUTES } from 'src/router/const'

const $q = useQuasar()
const { user, logout } = useAuth()
const router = useRouter()

const store = useSystemStore()
const isDarkMode = computed(() => store.isDarkMode)

const menuOpen = ref(false)
const onLogout = async () => {
  try {
    logout()
    notifyService.success(notifyMsgs.logoutSuccess)
    router.push(ROUTES.LOGIN)
  } catch (err) {
    log.error('Logout failed:', err)
    notifyService.error(notifyMsgs.logoutFailed)
  }
}

function onOpenSettingsModal() {
  menuOpen.value = false

  $q.dialog({
    component: SettingsModal,
    componentProps: {
      // company: companyToEdit,
      // companies: companies.value,
    },
  })
    .onOk(() => {})

    .onCancel(() => {
      // console.log('Dialog cancelled')
    })
}

function _getButtonColor() {
  return !isDarkMode.value ? (menuOpen.value ? 'primary' : 'secondary') : 'secondary'
}
</script>

<style lang="scss">
@import 'src/css/setup/_functions.scss';
@import 'src/css/setup/_variables.scss';
.user-menu {
  display: inline-block;
  .user-avatar-btn {
    min-width: rem(40px);
    min-height: rem(40px);
    transition: all 0.2s ease-in-out;
    &:hover {
      transform: scale(1.05);
    }
  }
}

.user-menu-dropdown {
  z-index: 100000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  &.dark-mode {
    background-color: $clr-surface !important;
  }

  .q-list {
    .q-item__section--avatar {
      min-width: rem(40px);
    }
  }

  &.dark-mode {
    .q-item__label {
      color: $clr-text-primary !important;
    }
  }
}
</style>
