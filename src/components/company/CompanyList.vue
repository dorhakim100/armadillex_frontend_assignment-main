<template>
  <div class="container">
    <!-- <pre>
        {{ JSON.stringify(companies, null, 2) }}
      </pre
    > -->
    <company-table :companies="companies" />
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'

import CompanyTable from './CompanyTable.vue'

const props = defineProps(['companies'])
const { companies } = props
</script>
<style scoped lang="scss">
.container {
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // justify-content: center;
}
</style>
