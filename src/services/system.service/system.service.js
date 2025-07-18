const SITENAME_PREFS = 'armadillexCompaniesDbPrefs'

export const systemService = {
  getPrefs,
  setPrefs,
}

function getPrefs() {
  const entityType = SITENAME_PREFS
  let prefs
  const stringifyPrefs = localStorage.getItem(entityType)
  if (!stringifyPrefs) {
    prefs = _getDefaultPrefs()
    localStorage.setItem(entityType, JSON.stringify(prefs))
  } else {
    prefs = JSON.parse(stringifyPrefs)
  }

  return prefs
}

function setPrefs(prefs) {
  const entityType = SITENAME_PREFS
  localStorage.setItem(entityType, JSON.stringify(prefs))
}

function _getDefaultPrefs() {
  return {
    isDarkMode: false,
  }
}
