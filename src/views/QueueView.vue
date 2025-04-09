<template>
  <div>
    <h2>Ожидание товара</h2>
    <button @click="store.enterQueue">Заказать товар</button>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '../stores/user'
const store = useUserStore()
</script>