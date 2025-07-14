<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">Edit Company</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="company.name" label="Company Name" />
        <q-input v-model="company.legalName" label="Legal Name" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" @click="onDialogCancel" />
        <q-btn color="primary" label="Save" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'

const props = defineProps({
  company: Object,
})

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const company = ref({ ...props.company })

function onOKClick() {
  // on OK, it is REQUIRED to
  // call onDialogOK (with optional payload)
  onDialogOK(company.value)
  // or with no payload: onDialogOK()
  // ...and it will also hide the dialog automatically
}
</script>
