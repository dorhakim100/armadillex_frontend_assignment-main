import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
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

  return {
    // Query state
    companies: companiesQuery.data,
    isLoading: companiesQuery.isLoading,
    error: companiesQuery.error,

    // Mutations
    saveCompany: saveCompany.mutate,

    // Mutation states
    isSaving: saveCompany.isPending,
    saveError: saveCompany.error,

    // Raw mutation object (for advanced usage)
    // saveCompanyMutation: saveCompany,
  }
}
