<template>
  <div>
    <h2>{{t('workPlace')}} <b>{{ store.$state.user?.name }}</b></h2>
    <h2>{{store.$state.user?.table}}</h2>
    <button :disabled="store.$state.isLoading" class="big-button" @click="store.enterQueue">🛎 {{t('getQueue')}} 🛎</button>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '../stores/user'
import {useI18n} from "vue-i18n";
const store = useUserStore()

const {t} = useI18n();
</script>