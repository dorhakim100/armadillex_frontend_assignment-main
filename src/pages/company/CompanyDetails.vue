<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center" :class="[isDarkMode ? 'dark-mode' : '']">
      <q-btn icon="arrow_back" flat round @click="$router.back()" />
      <span class="text-h5">Company Details</span>
      <q-btn icon="edit" flat label="Edit" @click="showEditModal = true" class="q-mr-sm">
        <q-tooltip>Edit Company</q-tooltip>
      </q-btn>
    </div>
    <!-- Main Company Card -->
    <q-card class="main-card-container" :class="[isDarkMode ? 'dark-mode' : '']">
      <inner-loading
        v-if="!companyCopy.id && !isMobile"
        :showing="isLoading"
        :label="'Loading company...'"
      />
      <q-card-section class="company-header-container">
        <div class="text-h5">{{ companyCopy.name }}</div>
        <img :src="logo" alt="Logo" />
      </q-card-section>

      <q-separator spaced />

      <q-card-section class="details-container">
        <div class="legel-name-container">
          <span class="text-caption text-grey">Legal Name</span>
          <span class="text-body1">{{ companyCopy.legalName }}</span>
        </div>
        <div class="country-container">
          <span class="text-caption text-grey">Country</span>
          <span class="text-body1">{{ companyCopy.country }}</span>
        </div>

        <div class="parent-company-container">
          <span class="text-caption text-grey">Parent Company</span>
          <div class="text-body1">
            <q-btn
              v-if="companyWithParent.parent"
              flat
              dense
              no-caps
              class="text-primary"
              :class="[isDarkMode ? 'dark-mode' : '']"
              @click="navigateToCompany(companyWithParent.parent.id)"
              >{{ companyWithParent.parent.name }}</q-btn
            >
            <span v-else>—</span>
          </div>
        </div>
        <div class="date-container">
          <span class="text-caption text-grey">Date Added</span>
          <span class="text-body1">{{ formattedDate }}</span>
        </div>

        <div class="icons-container">
          <custom-icon
            v-for="(icon, index) in companyFieldIcons"
            :key="icon.field"
            :icon="{
              name: companyCopy[icon.field] ? icon.trueIcon.name : icon.falseIcon.name,
              color: companyCopy[icon.field] ? icon.trueIcon.color : icon.falseIcon.color,
              field: icon.field,
            }"
            :isSeparator="index !== companyFieldIcons.length - 1"
          />
        </div>
      </q-card-section>
      <inner-loading v-if="!isMobile" :showing="isLoading" :label="'Loading company...'" />
    </q-card>

    <!-- Placeholder for future sections -->
    <q-card class="more-info-container" :class="[isDarkMode ? 'dark-mode' : '']">
      <q-card-section class="more-info-card">
        <span class="text-h6">More Info</span>
        <span class="text-caption text-grey">
          This section can show contacts, addresses, or AI tags.
        </span>
        <q-btn
          flat
          dense
          no-caps
          class="text-primary q-pa-none link-button"
          href="https://google.com"
          target="_blank"
          label="Visit Site"
          icon-right="open_in_new"
          :class="[isDarkMode ? 'dark-mode' : '']"
        />
        <div class="socials-container">
          <q-btn
            v-for="social in companySocials"
            :key="social.key"
            flat
            round
            dense
            :href="social.getHref(companyCopy)"
            target="_blank"
          >
            <q-tooltip>{{ social.tooltip }}</q-tooltip>
            <img :src="socialsImgs.find((img) => img.key === social.key)?.icon" alt="Social Icon" />
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
  <q-dialog v-model="showEditModal" transition-show="scale" transition-hide="scale">
    <company-edit
      :company="companyCopy"
      :companies="companies"
      @close="showEditModal = false"
      @save="onSaveClick"
      @delete="onDeleteClick"
      :show="showEditModal"
    />
  </q-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { formatUtcToDisplayDate } from 'src/services/util.service'
import { notifyMsgs, notifyService } from 'src/services/notify.service'

import { useCompanyById } from 'src/composables/useCompanyById'
import { useCompanies } from 'src/composables/useCompanies'
import { useGlobalLoading } from 'src/composables/useGlobalLoading'
import { useSystemStore } from 'src/stores/system'

import CompanyEdit from 'src/components/company/CompanyEdit.vue'
import InnerLoading from 'src/components/common/InnerLoading.vue'
import CustomIcon from 'src/components/custom/CustomIcon.vue'

import { companyFieldIcons } from 'src/config/company/boolean.icons'
import { companySocials } from 'src/config/company/socials'
import { useScreen } from 'src/composables/useScreen'

import logo from 'src/assets/company/sample-company-logo.png'
import whatsapp from 'src/assets/imgs/whatsapp.svg'
import linkedin from 'src/assets/imgs/linkedin.svg'
import email from 'src/assets/imgs/email.svg'

const route = useRoute()
const router = useRouter()

const showEditModal = ref(false)
const { isMobile } = useScreen()
const store = useSystemStore()

const { company, companies } = useCompanyById(computed(() => route.params.id))
const companyCopy = computed(() => ({ ...company.value }))

const { saveCompany, deleteCompany } = useCompanies()

const isDarkMode = computed(() => store.isDarkMode)
const { isLoading } = useGlobalLoading()

const socialsImgs = [
  { key: 'whatsapp', icon: whatsapp },
  { key: 'linkedin', icon: linkedin },
  { key: 'email', icon: email },
]

const companyWithParent = computed(() => {
  const parent = companies.value?.find((c) => c.id === company?.value.parentId)
  return {
    ...companyCopy.value,
    parent: parent ? { id: parent.id, name: parent.name } : null,
  }
})

const formattedDate = computed(() =>
  company.value?.dateAdded ? formatUtcToDisplayDate(company.value.dateAdded) : '',
)

function navigateToCompany(id) {
  if (!id) return notifyService.error(notifyMsgs.companyNotFound)
  router.push({ name: 'company-details', params: { id } })
}

function onSaveClick() {
  saveCompany(companyCopy.value)
  showEditModal.value = false
}

function onDeleteClick() {
  deleteCompany(companyCopy.value.id)
  router.push({ name: 'company' })
}
</script>

<style scoped lang="scss">
@import 'src/css/setup/_variables.scss';
.q-card {
  padding: 0.8rem;
  margin-bottom: 1.5rem;
}
.text-caption {
  font-weight: 500;
}
.items-center {
  display: grid;
  grid-template-columns: auto 1fr auto;
  margin-bottom: 0.8em;
}

.main-card-container {
  &.dark-mode {
    background-color: $clr-surface-elevated !important;
  }
}
.company-header-container {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 1em;
  // grid-template-rows: repeat(2, 1fr);

  &.dark-mode {
    background-color: $clr-surface-elevated;
    color: $clr-text-primary;
  }

  img {
    grid-column: 2/3;
    grid-row: 1/-1;
    width: 80px;
  }
}

.details-container {
  display: grid;
  gap: 1.5em;
  grid-template-columns: repeat(auto-fit, minmax(fit-content, 1fr));
  grid-template-rows: repeat(2, 1fr);
  align-items: center;

  @media (max-width: 600px) {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 0.6rem;
  }

  div:not(.icons-container) {
    display: flex;
    flex-direction: column;
    align-items: start;
  }
  .parent-company-container {
    grid-column: 1/2;
    grid-row: 2/3;
  }
  .date-container {
    grid-column: 2/3;
    grid-row: 2/3;
  }
}
.icons-container {
  grid-row: 1/-1;
  display: flex;
  gap: 1.8em;
  // align-items: center;
  justify-content: end;

  @media (max-width: 600px) {
    padding: 1em;
    align-self: stretch;

    justify-content: space-between;
  }
}

.more-info-container {
  &.dark-mode {
    background-color: $clr-surface-elevated !important;
  }
}
.more-info-card {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;

  span {
    grid-column: 1/2;
  }

  .link-button {
    grid-row: 1/-1;
    grid-column: 2/-1;

    justify-self: end;
    align-self: center;
  }

  .socials-container {
    grid-column: 1/-1;
    justify-self: center;
    display: flex;
    gap: 1rem;

    img {
      width: 2rem;
    }
  }
}
</style>
