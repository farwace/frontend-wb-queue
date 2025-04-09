<template>
  <div class="app">
    <component :is="currentComponent" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useUserStore } from './stores/user'
import AuthView from './views/AuthView.vue'
import EnterNameView from './views/EnterNameView.vue'
import SelectTableView from './views/SelectTableView.vue'
import QueueView from './views/QueueView.vue'
import ReceivedView from './views/ReceivedView.vue'

const store = useUserStore()

onMounted(() => {
  store.checkAuth()
})

const currentComponent = computed(() => {
  if (!store.isAuthorized) return AuthView
  if (!store.user?.name) return EnterNameView
  if (!store.user?.table) return SelectTableView
  return store.inQueue ? ReceivedView : QueueView
})
</script>

<style scoped>
.app {
  font-size: 1.5rem;
  padding: 2rem;
  font-family: sans-serif;
}
</style>
