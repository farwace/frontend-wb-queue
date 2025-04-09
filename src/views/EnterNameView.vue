<template>
  <div>
    <h2>Введите имя</h2>
    <input v-model="name" placeholder="Ваше имя" />
    <button @click="submit">Сохранить</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user'

const store = useUserStore()
const name = ref('')

const submit = async () => {
  await store.updateName(name.value)
}
</script>