import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import { usersService } from 'src/services/api/users.service'
import { QUERY_KEYS } from './const'
import { notifyMsgs, notifyService } from 'src/services/notify.service'

const queryKey = QUERY_KEYS.USERS

export function useCompanies() {
  const queryClient = useQueryClient()

  // Query for fetching users
  const usersQuery = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const users = await usersService.getUsers()
      notifyService.success(notifyMsgs.usersFetched)
      return users
    },
    onError: (error) => {
      notifyService.error(notifyMsgs.usersError)
      console.error('Users fetch error:', error)
    },
  })

  const saveUser = useMutation({
    mutationFn: async (user) => {
      return await usersService.saveUser(user)
    },
    // Optimistic update
    onMutate: async (user) => {
      const isEdit = !!user.id
      if (!isEdit) return { previousUsers: null, isEdit }

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousUsers = queryClient.getQueryData([queryKey])
      queryClient.setQueryData([queryKey], (old) => {
        return old?.map((u) => (u.id === user.id ? user : u)) || []
      })
      return { previousUsers, isEdit }
    },

    onError: (error, variables, context) => {
      // Restore previous data
      const { previousUsers } = context
      if (context?.isEdit && previousUsers) {
        queryClient.setQueryData([queryKey], context.previousUsers)
      }
      const isEdit = !!variables.id
      notifyService.error(isEdit ? notifyMsgs.companyEditFailed : notifyMsgs.companyAddFailed)
    },
    // api confirmed, update with real data
    onSuccess: (_, variables) => {
      const isEdit = !!variables.id
      notifyService.success(isEdit ? notifyMsgs.companyUpdated : notifyMsgs.companyAdded)
      if (!isEdit) {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
      }
    },
  })

  const deleteUser = useMutation({
    mutationFn: async (id) => {
      return await usersService.deleteUser(id)
    },
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousUsers = queryClient.getQueryData([queryKey])
      queryClient.setQueryData([queryKey], (old) => old.filter((c) => c.id !== id))
      return { previousUsers }
    },
    onError: (error, variables, context) => {
      // Restore previous data
      if (context?.previousUsers) {
        queryClient.setQueryData([queryKey], context.previousUsers)
      }
      notifyService.error(notifyMsgs.userDeleteFailed)
    },
    onSuccess: () => {
      notifyService.success(notifyMsgs.userDeleted)
    },
  })

  const isLoading = computed(() => {
    return usersQuery.isLoading.value || saveUser.isPending.value || deleteUser.isPending.value
  })

  return {
    // Query state
    users: usersQuery.data,
    isLoading,
    error: usersQuery.error,

    // Mutations
    saveUser: saveUser.mutate,
    deleteUser: deleteUser.mutate,

    // Mutation states
    isSaving: saveUser.isPending,
    saveError: saveUser.error,
    // @CR: Missing deleteError and isDeleting states for consistency
  }
}
