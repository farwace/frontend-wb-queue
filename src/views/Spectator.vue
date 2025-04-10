<template>
  <div>
    <h2>Очередь столиков</h2>

    <div class="queue">
      <template v-for="item in items" :key="item.id">
        <div class="item" v-if="!item.isClosed">
          {{ item.tableName }}
        </div>
      </template>
    </div>

  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import { useUserStore } from '../stores/user'

const store = useUserStore()

type TQueue = {
  id: number
  isClosed: boolean
  tableCode: string
  tableName: string
  workerName: string
}

const items = ref<TQueue[]>([]);

onMounted(() => {
  store.getQueue().then((queue) => {
    if((queue?.data?.data?.length || 0) > 0){
      items.value = queue?.data?.data as unknown as TQueue[]
    }
  });
})

</script>

<style scoped>
.queue{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.queue .item{
  border-radius: 1rem;
  border: 1px solid var(--color-border);
  padding: 2rem;
  text-align: center;
}
</style>