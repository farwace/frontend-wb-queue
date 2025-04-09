<template>
  <div>
    <h2>Выберите столик</h2>
    <ul>
      <li v-for="t in store.user?.tables" :key="t.id">
        <button @click="select(t.id)">{{ t.name }}</button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '../stores/user'

const store = useUserStore()

const select = async (id: number) => {
  await store.selectTable(id)
}
</script>