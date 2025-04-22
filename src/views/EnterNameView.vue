<template>
  <div>
    <h2>{{t('enterName')}}</h2>
    <input v-model="name" :placeholder="t('yourName')" />
    <button @click="submit">{{t('save')}}</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user'
import {useI18n} from "vue-i18n";

const store = useUserStore()
const name = ref('')

const submit = async () => {
  await store.updateName(name.value)
}

const {t} = useI18n();
</script>