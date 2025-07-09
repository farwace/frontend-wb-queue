<template>
  <div>
    <h2>{{t('workPlace')}} <b>{{ store.$state.user?.name }}</b></h2>
    <h2>{{store.$state.user?.table}} - {{t('productOnWay')}} 🏃‍➡️</h2>

    <input type="text" placeholder="Номер короба" v-model="message">
    <PhotoUploader v-model="photos" />

    <button :disabled="store.$state.isLoading" class="big-button" @click="onReceiveItem">✅ {{t('receivedProduct')}} ✅</button>

    <div style="margin-top: 40px; display: flex; flex-direction: row; gap: 20px;">
      <div>
        <img style="max-width: 200px; object-fit: contain" src="/img/example.png" alt="">
      </div>
      <div style="display: flex; flex-direction: column">
        <div style="margin: auto 0 auto">
          На фотографии должно быть четко видно: номер стола и привезенный паллет!
          Обязательно прописываем номер любого короба с привезённого паллета!
        </div>
      </div>
    </div>
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
const message = ref<string>();

const onReceiveItem = async () => {
  const formData = new FormData();
  formData.append('direction', DIRECTION_CODE);
  formData.append('message', message.value || '');
  photos.value.forEach(file => formData.append('attachments[]', file));
  await store.receiveItem(formData);
}
</script>