<template>
  <div class="container">
    <company-table :companies="props.companies" @onEdit="handleEdit" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

import CompanyTable from './CompanyTable.vue'

const props = defineProps(['companies', 'filter'])
const emit = defineEmits(['update', 'onOpenEdit'])
function handleEdit(company) {
  emit('onOpenEdit', company)
}
</script>
<style scoped lang="scss">
// .container {
// display: flex;
// flex-direction: column;
// align-items: center;
// justify-content: center;
// }
</style>
