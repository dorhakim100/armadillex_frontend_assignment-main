import { defineStore, acceptHMRUpdate } from 'pinia'

import { systemService } from 'src/services/system.service.js'

export const useSystemStore = defineStore('system', {
  state: () => ({
    prefs: systemService.getPrefs(),
  }),

  getters: {
    isDarkMode: (state) => state.prefs.isDarkMode,
  },

  actions: {
    setPrefs(prefsToSet) {
      this.prefs = prefsToSet
      systemService.setPrefs(prefsToSet)
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSystemStore, import.meta.hot))
}
