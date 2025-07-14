<template>
  <div class="container">
    <q-input filled v-model="date" type="text" mask="date" :rules="['date']">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale" anchor="top left">
            <q-date v-model="date" mask="DD/MM/YYYY">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date = ref('2019/02/01')
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  // align-items: center;
  // justify-content: center;

  label {
    padding: 0px;
  }
}
</style>
