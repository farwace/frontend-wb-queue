<template>
  <div class="modal-outer">
    <div class="modal">
      <div class="modal-body">
        <div class="modal-title" v-if="title">
          {{ title }}
        </div>
        <div class="modal-text" v-if="message">
          {{ message }}
        </div>
        <div class="modal-buttons">
          <button type="button" @click="emits('cancel')">{{ t('cancel') }}</button>
          <button type="button" @click="emits('accept')">{{t('apply')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useI18n} from "vue-i18n";

const emits = defineEmits([
    'accept',
    'cancel'
]);
const props = defineProps<{
  title?:string,
  message?:string,
}>();

const {t} = useI18n();

</script>

<style scoped>
.modal-outer{
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 100;
  left: 0;
  top: 0;
}
.modal-title{
  font-size: 2rem;
}
.modal-text{
  margin: 1rem 0;
}
.modal{
  border-radius: 1rem;
  padding: 2rem 3rem;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-background);
}
</style>