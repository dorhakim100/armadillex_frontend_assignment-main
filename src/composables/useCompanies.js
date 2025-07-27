import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, watch } from 'vue'
import { companiesService } from 'src/services/api/companies.service'
import { QUERY_KEYS } from './const'
import { notifyMsgs, notifyService } from 'src/services/notify.service'
import { useSystemStore } from 'src/stores/system'

export function useCompanies() {
  const queryClient = useQueryClient()
  const systemStore = useSystemStore()

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
    // Optimistic update
    onMutate: async (company) => {
      const isEdit = !!company.id
      if (!isEdit) return { previousCompanies: null, isEdit }

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.COMPANIES] })
      const previousCompanies = queryClient.getQueryData([QUERY_KEYS.COMPANIES])
      queryClient.setQueryData([QUERY_KEYS.COMPANIES], (old) => {
        return old?.map((c) => (c.id === company.id ? company : c)) || []
      })
      return { previousCompanies, isEdit }
    },

    onError: (error, variables, context) => {
      // Restore previous data
      const { previousCompanies } = context
      if (context?.isEdit && previousCompanies) {
        queryClient.setQueryData([QUERY_KEYS.COMPANIES], context.previousCompanies)
      }
      const isEdit = !!variables.id
      notifyService.error(isEdit ? notifyMsgs.companyEditFailed : notifyMsgs.companyAddFailed)
    },
    // api confirmed, update with real data
    onSuccess: (_, variables) => {
      const isEdit = !!variables.id
      notifyService.success(isEdit ? notifyMsgs.companyUpdated : notifyMsgs.companyAdded)
      if (!isEdit) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPANIES] })
      }
    },
  })

  const deleteCompany = useMutation({
    mutationFn: async (id) => {
      return await companiesService.deleteCompany(id)
    },
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.COMPANIES] })
      const previousCompanies = queryClient.getQueryData([QUERY_KEYS.COMPANIES])
      queryClient.setQueryData([QUERY_KEYS.COMPANIES], (old) => old.filter((c) => c.id !== id))
      return { previousCompanies }
    },
    onError: (error, variables, context) => {
      // Restore previous data
      if (context?.previousCompanies) {
        queryClient.setQueryData([QUERY_KEYS.COMPANIES], context.previousCompanies)
      }
      notifyService.error(notifyMsgs.companyDeleteFailed)
    },
    onSuccess: () => {
      notifyService.success(notifyMsgs.companyDeleted)
    },
  })

  const isLoading = computed(() => {
    return (
      companiesQuery.isLoading.value || saveCompany.isPending.value || deleteCompany.isPending.value
    )
  })

  // Sync loading state to global store
  //@CR: Duplicated DATA is NEVER a good option
  watch(
    isLoading,
    (newValue) => {
      systemStore.setIsLoading(newValue)
    },
    { immediate: true },
  )

  return {
    // Query state
    companies: companiesQuery.data,
    isLoading,
    error: companiesQuery.error,

    // Mutations
    saveCompany: saveCompany.mutate,
    deleteCompany: deleteCompany.mutate,

    // Mutation states
    isSaving: saveCompany.isPending,
    saveError: saveCompany.error,
    // @CR: Missing deleteError and isDeleting states for consistency
  }
}
