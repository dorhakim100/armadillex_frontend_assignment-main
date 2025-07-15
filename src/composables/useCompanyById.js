import { computed } from 'vue'
import { useCompanies } from './useCompanies'

export function useCompanyById(idRef) {
  const { companies, isLoading } = useCompanies()

  const company = computed(() => {
    if (!companies.value) return null
    return companies.value.find((c) => c.id === idRef.value)
  })

  return { company, isLoading, companies }
}
