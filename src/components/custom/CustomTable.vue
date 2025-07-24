<template>
  <div class="table-container">
    <q-table
      class="table"
      :rows="rows"
      :columns="columns"
      :row-key="rowKey"
      flat
      bordered
      :dark="isDarkMode"
      @row-click="(event, row) => onRowClick(row)"
      :body-row-class="getRowClass"
      :loading="loading"
      :grid="isMobile"
    >
      <!-- Dynamic slots for custom cell rendering -->
      <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>

      <!-- Default name cell template (can be overridden by parent) -->
      <template v-if="!$slots['body-cell-name']" v-slot:[`body-cell-name`]="props">
        <q-td :props="props">
          <component
            :is="nameFieldLinkEnabled ? 'router-link' : 'span'"
            v-bind="nameFieldLinkEnabled ? { to: getNameFieldLink(props.row) } : {}"
            :class="nameFieldLinkEnabled ? 'text-primary text-weight-medium text-no-wrap' : ''"
            :style="nameFieldLinkEnabled ? 'text-decoration: none' : ''"
          >
            {{ props.row[nameField] }}
          </component>
        </q-td>
      </template>

      <!-- Dynamic icon field templates -->
      <template
        v-for="iconField in iconFields"
        :key="iconField.field"
        v-slot:[`body-cell-${iconField.field}`]="props"
      >
        <q-td :props="props" class="icon-container">
          <q-icon
            :name="props.row[iconField.field] ? iconField.trueIcon.name : iconField.falseIcon.name"
            :color="
              props.row[iconField.field] ? iconField.trueIcon.color : iconField.falseIcon.color
            "
          />
        </q-td>
      </template>
    </q-table>

    <inner-loading v-if="isLoading" :label="loadingLabel" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import { useSystemStore } from 'src/stores/system'
import InnerLoading from '../common/InnerLoading.vue'

const props = defineProps({
  // Required props
  rows: {
    type: Array,
    required: true,
    default: () => [],
  },
  columns: {
    type: Array,
    required: true,
    default: () => [],
  },

  // Optional configuration props
  rowKey: {
    type: String,
    default: 'id',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showLoader: {
    type: Boolean,
    default: true,
  },
  loadingLabel: {
    type: String,
    default: 'Loading...',
  },

  // Icon fields configuration
  iconFields: {
    type: Array,
    default: () => [],
  },

  // Actions configuration
  showActions: {
    type: Boolean,
    default: false,
  },
  showEditButton: {
    type: Boolean,
    default: true,
  },

  // Name field configuration
  nameField: {
    type: String,
    default: 'name',
  },
  nameFieldLinkEnabled: {
    type: Boolean,
    default: false,
  },
  nameFieldLinkRoute: {
    type: String,
    default: '',
  },

  // Row click configuration
  clickableRows: {
    type: Boolean,
    default: true,
  },
  rowClass: {
    type: [String, Function],
    default: 'clickable-row',
  },
})

const emit = defineEmits(['row-click', 'edit-row'])

const store = useSystemStore()
const isDarkMode = computed(() => store.isDarkMode)
const isMobile = computed(() => store.isMobile)
const isLoading = computed(() => store.isLoading)

function getRowClass(row) {
  if (typeof props.rowClass === 'function') {
    return props.rowClass(row)
  }
  return props.clickableRows ? props.rowClass : ''
}

function getNameFieldLink(row) {
  if (!props.nameFieldLinkRoute) return '#'
  return { name: props.nameFieldLinkRoute, params: { id: row[props.rowKey] } }
}

function onRowClick(row) {
  if (props.clickableRows) {
    emit('row-click', row)
  }
}
</script>

<style scoped lang="scss">
.table-container {
  min-height: 380px;
  .table {
    :deep(th) {
      font-weight: 600;
      font-size: 1.1rem;
    }
    td {
      font-size: 1.1rem;
    }
  }
  .icon-container {
    text-align: center;
    i {
      font-size: 1.6rem;
    }
    &.group {
      text-align: start;
    }
  }
}
</style>
