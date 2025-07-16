import { defineStore, acceptHMRUpdate } from 'pinia'
import { systemService } from 'src/services/system.service/system.service.js'

export const useSystemStore = defineStore('system', {
  state: () => ({
    prefs: systemService.getPrefs(),
    isLoading: false,
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
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSystemStore, import.meta.hot))
}
