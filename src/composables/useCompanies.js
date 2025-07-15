import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import { companiesService } from 'src/services/api/companies.service'
import { QUERY_KEYS } from './const'
import { notifyMsgs, notifyService } from 'src/services/notify.service'

export function useCompanies() {
  const queryClient = useQueryClient()

  // Query for fetching companies
  const companiesQuery = useQuery({
    queryKey: [QUERY_KEYS.COMPANIES],
    queryFn: async () => {
      const companies = await companiesService.getCompanies()
      notifyService.success(notifyMsgs.companiesFetched)
      return companies
    },
    onError: (error) => {
      notifyService.error(notifyMsgs.companiesError)
      console.error('Companies fetch error:', error)
    },
  })

  const saveCompany = useMutation({
    mutationFn: async (company) => {
      return await companiesService.saveCompany(company)
    },
    onSuccess: (_, variables) => {
      const isEdit = !!variables.id
      notifyService.success(isEdit ? notifyMsgs.companyUpdated : notifyMsgs.companyAdded)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPANIES] })
    },
    onError: (error, variables) => {
      const isEdit = !!variables.id
      notifyService.error(isEdit ? notifyMsgs.companyEditFailed : 'Failed to add company')
      console.error('Company save error:', error)
    },
  })

  const deleteCompany = useMutation({
    mutationFn: async (id) => {
      return await companiesService.deleteCompany(id)
    },
    onSuccess: () => {
      notifyService.success(notifyMsgs.companyDeleted)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPANIES] })
    },
  })

  const isBusy = computed(() => {
    return companiesQuery.isLoading || saveCompany.isPending || deleteCompany.isPending
  })

  return {
    // Query state
    companies: companiesQuery.data,
    isLoading: isBusy,
    error: companiesQuery.error,

    // Mutations
    saveCompany: saveCompany.mutate,
    deleteCompany: deleteCompany.mutate,

    // Mutation states
    isSaving: saveCompany.isPending,
    saveError: saveCompany.error,
  }
}
