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
import {onMounted, onUnmounted, ref} from 'vue'
import { useUserStore } from '../stores/user'
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher?: typeof Pusher;
  }
}

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: Number(import.meta.env.VITE_REVERB_PORT),
  forceTLS: import.meta.env.VITE_REVERB_TLS === 'true',
  disableStats: true,
  enabledTransports: ['ws', 'wss'],

});


const store = useUserStore()

type TQueue = {
  id: number
  isClosed: boolean
  tableCode?: string
  tableName?: string
  workerName?: string
}

const items = ref<TQueue[]>([]);
const isReady = ref<boolean>(false);


echo.channel('orders')
    .listen('.order.requested', (queue: any) => {
      console.log(queue);
      if(isReady.value) {
        items.value = items.value.filter(item => item.id !== queue.id);
        if(!queue.isClosed){
          items.value.unshift(queue);
        }
      }
    });



onMounted(() => {

  store.getQueue().then((queue) => {
    if((queue?.data?.data?.length || 0) > 0){
      items.value = queue?.data?.data as unknown as TQueue[]
    }
    isReady.value = true;
  });
});

onUnmounted(() => {
  echo.disconnect();
})

</script>

<style scoped>
.queue{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
}

.queue .item{
  border-radius: 1rem;
  border: 1px solid var(--color-border);
  padding: 2rem;
  text-align: center;
  font-size: 3rem;
}
</style>