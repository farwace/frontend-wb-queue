<template>
  <div>
    <h2>{{t('workPlace')}} <b>{{ store.$state.user?.name }}</b></h2>
    <h2>{{store.$state.user?.table}} - {{t('productOnWay')}} 🏃‍➡️</h2>

    <PhotoUploader v-model="photos" />

    <button :disabled="store.$state.isLoading" class="big-button" @click="onReceiveItem">✅ {{t('receivedProduct')}} ✅</button>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '../stores/user'
import {useI18n} from "vue-i18n";
import PhotoUploader from "@/components/PhotoUploader.vue";
import {ref} from "vue";
const store = useUserStore()

const {t, locale} = useI18n();

const photos = ref<File[]>([]);
const DIRECTION_CODE = import.meta.env.VITE_DIRECTION_CODE || 'e0'

const onReceiveItem = async () => {
  const formData = new FormData();
  formData.append('direction', DIRECTION_CODE);
  photos.value.forEach(file => formData.append('attachments[]', file));
  await store.receiveItem(formData);
}
</script>