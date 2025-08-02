<template>
  <q-card :dark="isDarkMode" class="login-container" :class="[isDarkMode ? 'dark-mode' : '']">
    <q-card-section class="login-header">
      <div class="logo-section"></div>
      <h1>User Login</h1>
      <p class="subtitle">Sign in to your account</p>
    </q-card-section>

    <q-card-section class="login-form">
      <q-form @submit="onSubmit" class="form">
        <q-input
          v-model="loginForm.email"
          label="Email"
          type="email"
          outlined
          :dark="isDarkMode"
          :rules="emailRules"
          autocomplete="email"
          class="form-field"
        >
          <template v-slot:prepend>
            <q-icon name="email" />
          </template>
        </q-input>

        <q-input
          v-model="loginForm.password"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          outlined
          :dark="isDarkMode"
          :rules="passwordRules"
          autocomplete="current-password"
          class="form-field"
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>

        <custom-input v-model="loginForm.email" label="Password" type="password" icon="lock" />

        <div class="form-actions">
          <q-btn
            type="submit"
            color="primary"
            label="Login"
            class="login-btn"
            :loading="isLoading"
            :disable="!isFormValid"
            size="lg"
          />
        </div>

        <div class="form-links">
          <q-btn
            flat
            color="primary"
            label="Forgot Password?"
            @click="onForgotPassword"
            class="link-btn"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSystemStore } from 'src/stores/system'
import { useUsers } from 'src/composables/useUsers'
import { notifyService } from 'src/services/notify.service'

import CustomInput from 'src/components/custom/CustomInput.vue'

const router = useRouter()
const store = useSystemStore()
const { users } = useUsers()

// Reactive data
const loginForm = ref({
  email: '',
  password: '',
})

const showPassword = ref(false)
const isLoading = ref(false)

// Computed properties
const isDarkMode = computed(() => store.isDarkMode)

const demoUsers = computed(() => {
  if (!users.value) return []
  return users.value.slice(0, 3) // Show first 3 users for demo
})

const isFormValid = computed(() => {
  return loginForm.value.email && loginForm.value.password && loginForm.value.email.includes('@')
})

// Validation rules
const emailRules = [
  (val) => !!val || 'Email is required',
  (val) => val.includes('@') || 'Please enter a valid email',
]

const passwordRules = [
  (val) => !!val || 'Password is required',
  (val) => val.length >= 6 || 'Password must be at least 6 characters',
]

// Methods
async function onSubmit() {
  if (!isFormValid.value) return

  isLoading.value = true

  try {
    // Simulate login API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication - check if email exists in demo users
    const user = users.value?.find((u) => u.email === loginForm.value.email)

    if (user) {
      notifyService.success(`Welcome back, ${user.fullname}!`)
      // Navigate to main app or dashboard
      router.push('/companies')
    } else {
      notifyService.error('Invalid credentials. Try using one of the demo users.')
    }
  } catch (error) {
    notifyService.error('Login failed. Please try again.')
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}

function onForgotPassword() {
  notifyService.info('Password reset functionality would be implemented here')
}

function fillDemoCredentials(user) {
  loginForm.value.email = user.email
  loginForm.value.password = 'demo123'
  notifyService.info(`Filled credentials for ${user.fullname}`)
}

// Lifecycle
onMounted(() => {
  // Auto-fill first demo user credentials if available
  if (demoUsers.value.length > 0) {
    setTimeout(() => {
      fillDemoCredentials(demoUsers.value[0])
    }, 1500)
  }
})
</script>

<style scoped lang="scss">
@import 'src/css/setup/_variables.scss';

.login-container {
  max-width: 500px;
  margin: 2rem auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &.dark-mode {
    background-color: $clr-surface !important;
  }

  @media (max-width: $break-narrow) {
    margin: 1rem;
    max-width: none;
  }
}

.login-header {
  text-align: center;
  padding: 2rem 1.5rem 1rem;

  .logo-section {
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: inherit;

    @media (max-width: $break-narrow) {
      font-size: 2rem;
    }
  }

  .subtitle {
    color: $clr-text-secondary;
    font-size: 1.1rem;
    margin: 0;
  }
}

.login-form {
  padding: 1rem 1.5rem 2rem;

  .form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-field {
    .q-field__control {
      min-height: 56px;
    }
  }

  .form-actions {
    margin-top: 1rem;

    .login-btn {
      width: 100%;
      height: 48px;
      font-size: 1.1rem;
      font-weight: 600;
    }
  }

  .form-links {
    text-align: center;
    margin-top: 1rem;

    .link-btn {
      font-size: 0.9rem;
    }
  }
}

.login-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid $clr-border;
  background-color: rgba(0, 0, 0, 0.02);

  .dark-mode & {
    background-color: rgba(255, 255, 255, 0.02);
    border-top-color: rgba(255, 255, 255, 0.1);
  }

  .demo-credentials {
    text-align: center;

    .demo-title {
      font-size: 0.9rem;
      color: $clr-text-secondary;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .demo-users {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;

      .demo-chip {
        font-size: 0.8rem;
        cursor: pointer;
        transition: transform 0.2s;

        &:hover {
          transform: scale(1.05);
        }
      }
    }
  }
}

// Loading states
.q-btn--loading {
  pointer-events: none;
}
</style>
