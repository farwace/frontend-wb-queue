<template>
  <div>
    <h2>{{t('auth')}}</h2>
    <input v-model="badge" :placeholder="t('badgeNumber')" />
    <button @click="submit">{{t('login')}}</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user'
import {useI18n} from "vue-i18n";

const store = useUserStore()
const badge = ref('')

const submit = async () => {
  store.setBadge(badge.value)
  await store.checkAuth()
  // if (!store.user) await store.auth()
}

const {t, locale} = useI18n();
</script>