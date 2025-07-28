import { ref, computed, onMounted, onUnmounted } from 'vue'
import { breakpoints } from 'src/config/scss.variables'

const screenWidth = ref(window.innerWidth)

let listeners = 0

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth
}

export const useScreen = () => {
  onMounted(() => {
    if (listeners === 0) {
      window.addEventListener('resize', updateScreenWidth)
    }
    listeners++
  })

  onUnmounted(() => {
    listeners--
    if (listeners === 0) {
      window.removeEventListener('resize', updateScreenWidth)
    }
  })

  const isMobile = computed(() => screenWidth.value <= breakpoints.narrow)
  const isTablet = computed(
    () => screenWidth.value > breakpoints.narrow && screenWidth.value <= breakpoints.normal,
  )
  const isDesktop = computed(() => screenWidth.value > breakpoints.normal)

  return {
    screenWidth: computed(() => screenWidth.value),
    isMobile,
    isTablet,
    isDesktop,
  }
}
