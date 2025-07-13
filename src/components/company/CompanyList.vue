<template>
  <div class="container">
    <!-- <pre>
        {{ JSON.stringify(companies, null, 2) }}
      </pre
    > -->
    <div class="q-pa-md">
      <q-table title="Treats" :rows="rows" :columns="columns" row-key="name" />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'

import { columns, rows } from 'src/composables/useCompanyTableConfig'

const props = defineProps(['companies'])
const { companies } = props
</script>
<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
