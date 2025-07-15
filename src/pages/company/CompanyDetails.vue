<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center q-mb-md">
      <q-btn icon="arrow_back" flat round @click="$router.back()" />
      <div class="text-h5 q-ml-sm">Company Details</div>
    </div>

    <!-- Main Company Card -->
    <q-card class="q-pa-md q-mb-lg">
      <q-card-section>
        <div class="text-h6">{{ company.name }}</div>
        <div class="text-subtitle2 text-grey">ID: {{ company.id }}</div>
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
            <div class="text-caption text-grey">Parent Company</div>
            <div class="text-body1">{{ company.parentName || '—' }}</div>
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
import { useRoute } from 'vue-router'
import { formatDate } from 'src/services/util.service'

const route = useRoute()

// Ideally you'd fetch this based on route.params.id
const company = ref({
  id: route.params.id,
  name: 'Acme Corp',
  legalName: 'Acme Corporation Ltd.',
  country: 'USA',
  parentName: 'Global Holdings Inc.',
  dateAdded: '2025-01-26',
})

const formattedDate = computed(() =>
  company.value.dateAdded ? formatDate(company.value.dateAdded) : '',
)
</script>

<style scoped>
.text-caption {
  font-weight: 500;
}
</style>
