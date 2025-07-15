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

      <q-separator spaced />

      <q-card-section>
        <div class="row q-col-gutter-md q-mb-sm">
          <div class="col-12 col-md-6">
            <div class="text-caption text-grey">Legal Name</div>
            <div class="text-body1">{{ company.legalName }}</div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-caption text-grey">Country</div>
            <div class="text-body1">{{ company.country }}</div>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <span class="text-caption text-grey">Parent Company</span>
            <div class="text-body1">
              <q-btn
                v-if="companyWithParent.parent.id"
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
          <div class="col-12 col-md-6">
            <div class="text-caption text-grey">Date Added</div>
            <div class="text-body1">{{ formattedDate }}</div>
          </div>
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
import { formatUtcToDisplayDate } from 'src/services/util.service'
import { notifyMsgs, notifyService } from 'src/services/notify.service'

import { useCompanyById } from 'src/composables/useCompanyById'

import logo from 'src/assets/company/sample-company-logo.png'

const route = useRoute()
const router = useRouter()

const { company, isLoading, companies } = useCompanyById(computed(() => route.params.id))

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
</script>

<style scoped>
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
.text-caption {
  font-weight: 500;
}
</style>
