import { defineStore, acceptHMRUpdate } from 'pinia'
import { watch } from 'vue'
import { useQuasar } from 'quasar'
import { systemService } from 'src/services/system.service.js'
import { breakpoints } from 'src/config/scss.variables'

export const useSystemStore = defineStore('system', {
  state: () => ({
    prefs: systemService.getPrefs(),
    isLoading: false,
    isMobile: false,
  }),

  getters: {
    isDarkMode: (state) => state.prefs.isDarkMode,
    // isLoading: (state) => state.isLoading,
  },

  actions: {
    setPrefs(prefsToSet) {
      this.prefs = prefsToSet
      systemService.setPrefs(prefsToSet)
    },
    setIsLoading(stateToSet) {
      this.isLoading = stateToSet
    },
    setIsMobile(isMobileState) {
      this.isMobile = isMobileState
    },
    initializeScreenWatcher() {
      const $q = useQuasar()

      this.isMobile = $q.screen.width < breakpoints.narrow
      // @CR Watch inside an action????
      watch(
        () => $q.screen.width,
        (newWidth) => {
          this.isMobile = newWidth < breakpoints.narrow
        },
      )
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSystemStore, import.meta.hot))
}
