<template>
  <div>
    <h2>Товар получен</h2>
    <button @click="store.receiveItem">Товар получен</button>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '../stores/user'
const store = useUserStore()
</script>