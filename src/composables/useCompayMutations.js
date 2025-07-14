import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { companiesService } from 'src/services/api/companies.service'
import { notifyService, notifyMsgs } from 'src/services/notify.service'
import { QUERY_KEYS } from './const'

export function useCompanyMutations() {
  const queryClient = useQueryClient()

  const saveCompany = useMutation({
    mutationFn: async (newCompany) => {
      return await companiesService.saveCompany(newCompany)
    },
    onSuccess: () => {
      notifyService.success(notifyMsgs.companyAdded)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPANIES] })
    },
  })

  // const editCompany = useMutation({
  // mutationFn: async (updatedCompany) => {
  // return await companiesService.updateCompany(updatedCompany)
  // },
  // onSuccess: () => {
  //   notifyService.success(notifyMsgs.companyUpdated)
  //   queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPANIES] })
  // },
  // })

  return {
    saveCompany,
  }
}
