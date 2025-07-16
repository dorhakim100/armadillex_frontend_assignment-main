export function convertDateToUtcTS(date) {
  return Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  )
}

export function formatDateVerbal(dateStr) {
  const date = new Date(dateStr)
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const day = date.getDate()
  const monthIndex = date.getMonth()
  const year = date.getFullYear()

  return `${monthNames[monthIndex]} ${formatDay(day)}, ${year}`
}

function formatDay(day) {
  if (day > 3 && day < 21) return day + 'th' // for 4th to 20th
  switch (day % 10) {
    case 1:
      return day + 'st'
    case 2:
      return day + 'nd'
    case 3:
      return day + 'rd'
    default:
      return day + 'th'
  }
}

export function isValueEmpty(value) {
  return value === null || value === undefined || value === ''
}

export function makeId(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled) // The maximum is inclusive and the minimum is inclusive
}

export function formatDate(date) {
  return new Date(date).toUTCString()
}

export function formatUtcToDisplayDate(utcString) {
  if (!utcString) return ''

  const date = new Date(utcString)
  if (isNaN(date.getTime())) return ''

  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const year = date.getUTCFullYear()

  return `${day}/${month}/${year}`
}

// Convert ISO string to YYYY/MM/DD format for Quasar q-date component
export function convertToQuasarDateFormat(isoDateString) {
  if (!isoDateString) return ''

  const date = new Date(isoDateString)
  if (isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}/${month}/${day}`
}

// Convert YYYY/MM/DD format from Quasar q-date back to ISO string
export function convertFromQuasarDateFormat(quasarDateString) {
  if (!quasarDateString) return null

  const date = new Date(quasarDateString)
  if (isNaN(date.getTime())) return null

  return date.toISOString()
}
