<template>
  <div class="container">
    <company-table :companies="props.companies" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

import CompanyTable from './CompanyTable.vue'

const props = defineProps(['companies'])
</script>
<style scoped lang="scss">
.container {
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // justify-content: center;
}
</style>
