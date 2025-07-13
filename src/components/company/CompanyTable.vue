<template>
  <div class="table-container">
    <q-table title="Companies" :rows="companies" :columns="columns" row-key="id" flat bordered />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

import { columns } from 'src/composables/useCompanyTableConfig'

const props = defineProps(['companies'])
</script>

<style scoped lang="scss">
.table-container {
}
</style>
