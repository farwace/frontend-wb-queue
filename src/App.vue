<template>
  <div class="app">
    <Confirm v-if="confirmLogout" :message="'Вы действительно хотите покинуть рабочее место?'" :title="'Покинуть рабочее место'" @accept="logout" @cancel="confirmLogout = false"/>
    <div v-if="store.$state.isAuthorized" @click="tryLogout" class="logout-btn">
      Выйти
    </div>
    <div class="loading" v-if="store.isLoading">
      <div class="loading__inner">
        <loading-spinner/>
      </div>
    </div>
    <component :is="currentComponent" />
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref, watch} from 'vue'
import { useUserStore } from './stores/user'
import AuthView from './views/AuthView.vue'
import SpectatorView from './views/Spectator.vue'
import EnterNameView from './views/EnterNameView.vue'
import SelectTableView from './views/SelectTableView.vue'
import QueueView from './views/QueueView.vue'
import ReceivedView from './views/ReceivedView.vue'
import Confirm from './components/Confirm.vue'

import {storeToRefs} from "pinia";
import LoadingSpinner from "@/components/icons/LoadingSpinner.vue";

const store = useUserStore()

const confirmLogout = ref<boolean>(false);

const { isAuthorized, user, inQueue, isSpectatorMode } = storeToRefs(useUserStore())

onMounted(() => {
  store.checkAuth()
})

const currentComponent = computed(() => {
  if( isSpectatorMode.value) {return SpectatorView}
  if (!isAuthorized.value) return AuthView
  if (!user.value?.name) return EnterNameView
  if (!user.value?.table) return SelectTableView
  return inQueue.value ? ReceivedView : QueueView
})

const tryLogout = () => {
  confirmLogout.value = true;
}

const logout = async () => {
  confirmLogout.value = false;
  try{
    await store.logout();
    localStorage.removeItem('user')
    localStorage.removeItem('badge')
    window.location.reload()
  }
  catch (error) {
    store.$patch({
      isLoading: false,
    });
    store.showError('Непредвиденная ошибка. Попробуйте еще раз');
  }
}
</script>

<style scoped>
.app {
  font-size: 1.5rem;
  padding: 2rem;
  font-family: sans-serif;
}
.logout-btn {
  position: absolute;
  right: 30px;
  top: 2.5rem;
  cursor: pointer;
}

.loading{
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top:0;
  background-color: rgba(0,0,0,.3);
}
.loading__inner{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

<style>
h2{
  padding-right: 80px;
}
</style>