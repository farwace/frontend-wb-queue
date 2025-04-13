<template>
  <div>
    <h2>Очередь столов</h2>

    <div class="queue">
      <template v-for="item in items" :key="item.id">
        <div class="item" v-if="!item.isClosed">
          <div class="item-bg" :style="{backgroundColor: item.color || ''}"></div>
          <div class="item-body">
            <div>
              {{ item.tableName }}
            </div>
            <div>{{ formatDuration(item.timestamp!, currentTime) }}</div>
          </div>
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
  timestamp?: Date,
  color?: string
}

let interval: ReturnType<typeof setInterval>
const currentTime = ref(new Date())
const items = ref<TQueue[]>([]);
const isReady = ref<boolean>(false);


echo.channel('orders')
    .listen('.order.requested', (queue: any) => {
      console.log(queue);
      if(isReady.value) {
        items.value = items.value.filter(item => item.id !== queue.id);
        if(!queue.isClosed){
          if(queue.timestamp){
            queue.timestamp = new Date(queue.timestamp);
          }

          items.value.push(queue);
        }
      }
    });



onMounted(() => {
  interval = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)

  store.getQueue().then((queue) => {
    if((queue?.data?.data?.length || 0) > 0){
      items.value = (queue?.data?.data as unknown as TQueue[]).map((item) => {
        if(item.timestamp){
          item.timestamp = new Date(item.timestamp);
        }
        return item;
      })
    }
    isReady.value = true;
  });
});

onUnmounted(() => {
  echo.disconnect();
  clearInterval(interval);
})

const formatDuration = (from: Date, to: Date): string => {
  const diff = Math.floor((to.getTime() - from.getTime()) / 1000)
  const hours = Math.floor(diff / 3600)
  const minutes = Math.floor((diff % 3600) / 60)
  const seconds = diff % 60

  const pad = (n: number) => n.toString().padStart(2, '0')
  return diff > 0 ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : '00:00:00'
}

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
  position: relative;
}
.item-bg{
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 1rem;
  z-index: 1;
  opacity: .3;
}

.item-body{
  position: relative;
  z-index: 2;
}
</style>