<template>
  <q-card :dark="isDarkMode" class="login-container" :class="[isDarkMode ? 'dark-mode' : '']">
    <q-card-section class="login-header">
      <div class="logo-section"></div>
      <h1 v-if="!!user">{{ user?.fullname }}</h1>
      <h1 v-else>User Login</h1>
      <p class="subtitle">Sign in to your account</p>
    </q-card-section>

    <q-card-section class="login-form">
      <q-form @submit="onSubmit" class="form">
        <custom-input
          v-for="(input, index) in loginInputs"
          :key="index"
          v-model="loginForm[input.type]"
          :label="input.label"
          :type="input.type"
          :icon="input.icon"
          :rules="input.rules"
        />

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
            label="Example User"
            @click="onExampleUser"
            class="link-btn"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from 'src/composables/useAuth'

import { useSystemStore } from 'src/stores/system'

import { inputs as loginInputs } from 'src/config/login/loginInputs'
import { ROUTES } from 'src/router/const'

import CustomInput from 'src/components/custom/CustomInput.vue'

const router = useRouter()
const store = useSystemStore()
const { user, login, isLoading } = useAuth()
// const { isLoading } = useGlobalLoading()

const loginForm = ref(_getLoginForm())

const isDarkMode = computed(() => store.isDarkMode)

// make sure all the rules are valid,
// based on the type of the input
const isFormValid = computed(() => {
  return loginInputs.every((input) =>
    input.rules.every((rule) => rule(loginForm.value[input.type])),
  )
})

// Methods
async function onSubmit() {
  if (!isFormValid.value) {
    return
  }
  login(loginForm.value)
}

function onExampleUser() {
  loginForm.value = {
    email: 'john.doe1@example.com',
    password: '123456',
  }
}

function _getLoginForm() {
  return loginInputs.reduce((acc, input) => {
    acc[input.type] = ''
    return acc
  }, {})
}

watch(user, (newUser) => {
  if (newUser) {
    router.push(ROUTES.COMPANY)
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
