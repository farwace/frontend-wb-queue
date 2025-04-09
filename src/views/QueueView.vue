<template>
  <div>
    <h2>Рабочее место <b>{{ store.$state.user?.name }}</b></h2>
    <h2>{{store.$state.user?.table}}</h2>
    <button :disabled="store.$state.isLoading" class="big-button" @click="store.enterQueue">🛎 Заказать товар 🛎</button>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '../stores/user'
const store = useUserStore()
</script>