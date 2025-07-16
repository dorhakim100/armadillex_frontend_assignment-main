import { computed, watch } from 'vue'
import { useCompanies } from './useCompanies'
import { useSystemStore } from 'src/stores/system'

export function useCompanyById(idRef) {
  const { companies, isLoading } = useCompanies()
  const systemStore = useSystemStore()

  const company = computed(() => {
    if (!companies.value) return null
    return companies.value.find((c) => c.id === idRef.value)
  })

  watch(
    isLoading,
    (newValue) => {
      systemStore.setIsLoading(newValue)
    },
    { immediate: true },
  )

  return { company, isLoading, companies }
}
