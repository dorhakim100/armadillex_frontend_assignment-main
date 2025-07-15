<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center q-mb-md">
      <q-btn icon="arrow_back" flat round @click="$router.back()" />
      <span class="text-h5 q-ml-sm">Company Details</span>
      <q-btn icon="edit" flat label="Edit" @click="onEdit" class="q-mr-sm">
        <q-tooltip>Edit Company</q-tooltip>
      </q-btn>
    </div>

    <!-- Main Company Card -->
    <q-card class="q-pa-md q-mb-lg">
      <q-card-section class="company-header-container">
        <div class="text-h6">{{ company.name }}</div>
        <div class="text-subtitle2 text-grey">ID: {{ company.id }}</div>
        <img :src="logo" alt="Logo" />
      </q-card-section>

      <!-- <q-separator spaced /> -->

      <q-separator spaced />

      <q-card-section class="details-container">
        <div class="legel-name-container">
          <span class="text-caption text-grey">Legal Name</span>
          <span class="text-body1">{{ company.legalName }}</span>
        </div>
        <div class="country-container">
          <span class="text-caption text-grey">Country</span>
          <span class="text-body1">{{ company.country }}</span>
        </div>

        <div class="parent-company-container">
          <span class="text-caption text-grey">Parent Company</span>
          <div class="text-body1">
            <q-btn
              v-if="companyWithParent.parent"
              flat
              dense
              no-caps
              class="text-primary q-pa-none"
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
          <q-icon
            v-for="(iconField, index) in companyFieldIcons"
            :key="index"
            :name="company[iconField.field] ? iconField.trueIcon.name : iconField.falseIcon.name"
            :color="company[iconField.field] ? 'positive' : 'grey-5'"
            size="md"
          >
            <q-tooltip>{{ iconField.label }}</q-tooltip>
          </q-icon>
        </div>
      </q-card-section>
    </q-card>

    <!-- Placeholder for future sections -->
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">More Info</div>
        <div class="text-caption text-grey">
          This section can show contacts, addresses, or AI tags.
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

import { formatUtcToDisplayDate } from 'src/services/util.service'
import { notifyMsgs, notifyService } from 'src/services/notify.service'

import { useCompanyById } from 'src/composables/useCompanyById'
import { useCompanies } from 'src/composables/useCompanies'

import EditCompany from 'src/components/company/EditCompany.vue'

import { companyFieldIcons } from 'src/config/company/boolean.icons'

import logo from 'src/assets/company/sample-company-logo.png'

const route = useRoute()
const router = useRouter()

const $q = useQuasar()

const { company, isLoading, companies } = useCompanyById(computed(() => route.params.id))
const { saveCompany, deleteCompany } = useCompanies()

console.log(company.value)
const companyWithParent = computed(() => {
  const parent = companies.value.find((c) => c.id === company.value.parentId)
  return {
    ...company,
    parent: parent ? { id: parent.id, name: parent.name } : null,
  }
})

const formattedDate = computed(() =>
  company.value.dateAdded ? formatUtcToDisplayDate(company.value.dateAdded) : '',
)

function navigateToCompany(id) {
  if (!id) return notifyService.error(notifyMsgs.companyNotFound)
  router.push({ name: 'company-details', params: { id } })
}

function onEdit() {
  $q.dialog({
    component: EditCompany,
    componentProps: {
      company: company.value,
      companies: companies.value,
    },
  }).onOk(async (clickEvent) => {
    const { action, company: editedCompany } = clickEvent

    if (action === 'delete') {
      try {
        await deleteCompany(editedCompany.id)
      } catch (err) {
        console.error('Delete failed:', err)
      }
    } else {
      try {
        await saveCompany(editedCompany)
      } catch (err) {
        console.error('Save failed:', err)
      }
    }
  })
}
</script>

<style scoped>
.text-caption {
  font-weight: 500;
}
.items-center {
  display: grid;
  grid-template-columns: auto 1fr auto;
}
.company-header-container {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: repeat(2, 1fr);

  img {
    grid-column: 2/3;
    grid-row: 1/-1;
    width: 80px;
  }
}

.details-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(fit-content, 1fr));
  grid-template-rows: repeat(2, 1fr);
  align-items: center;

  @media (max-width: 600px) {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 0.6rem;

    /* grid-template-columns: 1fr; */
    /* grid-template-rows: repeat(4, auto); */
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
  gap: 24px;
  align-items: center;
  justify-content: end;
  padding: 0 0 12px 0; /* reduced bottom padding */
  margin: 0;

  @media (max-width: 600px) {
    align-self: stretch;
    justify-content: space-between;
  }
}
</style>
