<template>
  <div class="container" :class="{ 'cards-container': isMobile }">
    <custom-table
      :rows="props.companies"
      :columns="columns"
      :iconFields="companyFieldIcons"
      :showActions="true"
      @row-click="navigateToCompany"
    >
      <template v-slot:[`body-cell-edit`]="props">
        <q-td :props="props" class="icon-container group edit-icon">
          <slot name="actions" :row="props.row">
            <q-btn
              @click="
                (event) => {
                  event.stopPropagation()
                  handleEdit(props.row)
                }
              "
              flat
              round
              color="primary"
              icon="edit"
            />
          </slot>
        </q-td>
      </template>
      <!-- Grid layout -->
      <template v-slot:item="props">
        <q-card
          class="q-ma-sm company-card"
          @click="navigateToCompany(props.row)"
          :dark="isDarkMode"
        >
          <q-card-section>
            <div class="text-h6">{{ props.row.name }}</div>
          </q-card-section>
          <q-card-section class="icons-container">
            <slot v-for="(icon, index) in companyFieldIcons" :key="icon.field" :name="icon.field">
              <div class="icon-wrapper">
                <q-icon
                  :name="props.row[icon.field] ? icon.trueIcon.name : icon.falseIcon.name"
                  :color="props.row[icon.field] ? icon.trueIcon.color : icon.falseIcon.color"
                />
                <span>{{ capitalizeFirstLetter(icon.field) }}</span>
              </div>
              <q-separator vertical v-if="index !== companyFieldIcons.length - 1" />
            </slot>
          </q-card-section>
          <q-card-actions align="right">
            <slot name="actions" :row="props.row">
              <q-btn flat round icon="edit" @click.stop="handleEdit(props.row)" />
            </slot>
          </q-card-actions>
        </q-card>
      </template>
    </custom-table>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { useRouter } from 'vue-router'

import { companyFieldIcons } from 'src/config/company/boolean.icons'
import { columns } from 'src/config/company/table.config'
import { capitalizeFirstLetter } from 'src/services/util.service'

import CustomTable from 'src/components/custom/CustomTable.vue'

import { useSystemStore } from 'src/stores/system'

const props = defineProps(['companies', 'filter'])
const emit = defineEmits(['update', 'onOpenEdit'])

const router = useRouter()

const store = useSystemStore()

const isMobile = computed(() => store.isMobile)
const isDarkMode = computed(() => store.isDarkMode)

function handleEdit(company) {
  emit('onOpenEdit', company)
}
function navigateToCompany(company) {
  console.log(company)

  router.push({ name: 'company-details', params: { id: company.id } })
}
</script>
<style scoped lang="scss">
.edit-icon {
  text-align: end;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  justify-content: start;
}
.company-card {
  width: 100%;
  cursor: pointer;
  transition: 0.2s ease-out;
  min-width: 250px;
  &:hover {
    transform: translateY(-2px);
  }

  &.q-dark {
    background-color: var(--q-dark-bg);
    color: var(--q-dark-text);
  }

  @media (min-width: 600px) {
    width: calc(50% - 1rem);
  }

  @media (min-width: 1024px) {
    width: calc(33.333% - 1rem);
  }
}
.icons-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  .icon-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    text-align: center;
    gap: 0.5rem;

    i {
      align-self: center;
      font-size: 1.5rem;
    }

    span {
      font-size: 0.8rem;
    }
  }
}
</style>
