import { useQueryClient, useMutation, useQuery } from '@tanstack/vue-query'
import { usersService } from 'src/services/api/users.service'
import { notifyService, notifyMsgs } from 'src/services/notify.service'
import { computed } from 'vue'

// src/composables/useAuth.js
export function useAuth() {
  const queryClient = useQueryClient()

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      return await usersService.getUserByCredentials(credentials)
    },
    onSuccess: (data) => {
      // Store token, update auth state

      queryClient.setQueryData(['auth', 'user'], data)
      notifyService.success(notifyMsgs.loginSuccess)
      return data
    },
    onError: () => {
      notifyService.error(notifyMsgs.loginFailed)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // return await usersService.logout()
      queryClient.setQueryData(['auth', 'user'], null)
      queryClient.clear()
    },
    onSuccess: () => {
      // queryClient.setQueryData(['auth', 'user'], null)
      notifyService.success(notifyMsgs.logoutSuccess)
    },
  })

  // Current user query (for auth state)
  const userQuery = useQuery({
    queryKey: ['auth', 'user'],
    // queryFn: usersService.getCurrentUser,
    retry: false,
    staleTime: Infinity,
  })

  return {
    // Auth state
    user: userQuery.data,
    isAuthenticated: computed(() => !!userQuery.data),
    isLoading: computed(() => loginMutation.isPending.value),

    // Actions
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
  }
}
