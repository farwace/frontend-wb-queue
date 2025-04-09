<template>
  <div>
    <h2>Авторизация</h2>
    <input v-model="badge" placeholder="Введите номер бейджа" />
    <button @click="submit">Войти</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user'

const store = useUserStore()
const badge = ref('')

const submit = async () => {
  store.setBadge(badge.value)
  await store.checkAuth()
  // if (!store.user) await store.auth()
}
</script>