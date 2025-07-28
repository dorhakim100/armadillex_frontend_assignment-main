import { computed } from 'vue'
import { useIsFetching } from '@tanstack/vue-query'
// import {  useIsMutating } from '@tanstack/vue-query'

export function useGlobalLoading() {
  // Track if any queries are currently fetching
  const isFetching = useIsFetching()

  // const isMutating = useIsMutating()

  // Wondering if setting a loader when updating
  // is a good UX

  const isLoading = computed(() => {
    return isFetching.value > 0
    // return isFetching.value > 0 || isMutating.value > 0
  })

  return {
    isLoading,
  }
}
