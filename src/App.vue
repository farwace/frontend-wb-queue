<template>
  <div class="app">
    <Confirm v-if="confirmLogout" :message="t('askLogout')" :title="t('logoutTitle')" @accept="logout" @cancel="confirmLogout = false">
      <PhotoUploader v-model="photos" />
    </Confirm>
    <div v-if="!isSpectatorMode">
      <select style="font-size: 1.5rem; text-transform: uppercase" @change="changeLang(($event?.target as any)?.value)">
        <option :value="locale" selected>{{ locale }}</option>
        <option v-for="loc in availableLocales" :key="'locale-'+loc" :value="loc">{{loc}}</option>
      </select>
    </div>
    <div v-if="store.$state.isAuthorized" @click="tryLogout" class="logout-btn">
      {{ t('logout') }}
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
import {useI18n} from "vue-i18n";
import PhotoUploader from "@/components/PhotoUploader.vue";

const store = useUserStore()

const confirmLogout = ref<boolean>(false);

const { isAuthorized, user, inQueue, isSpectatorMode } = storeToRefs(useUserStore())
const photos = ref<File[]>([]);
const DIRECTION_CODE = import.meta.env.VITE_DIRECTION_CODE || 'e0'

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
  const formData = new FormData();
  formData.append('direction', DIRECTION_CODE);
  photos.value.forEach(file => formData.append('attachments[]', file));

  confirmLogout.value = false;
  try{
    await store.logout(formData);
    localStorage.removeItem('user')
    localStorage.removeItem('badge')
    window.location.reload()
  }
  catch (error: any) {
    store.$patch({
      isLoading: false,
    });
    if(error?.response?.data?.message){
      store.showError(error?.response?.data?.message);
    }
    else{
      store.showError(t('somethingWentWrong'));
    }
  }
}

const {t, locale} = useI18n({
  useScope: "global",
  messages: {
    ru: {
      logout: 'Выйти',
      askLogout: 'Вы действительно хотите покинуть рабочее место?',
      logoutTitle: 'Покинуть рабочее место',
      somethingWentWrong: 'Непредвиденная ошибка. Попробуйте еще раз',
      cancel: 'Отменить',
      apply: 'Принять',
      enterName: 'Введите имя',
      yourName: 'Ваше имя',
      save: 'Сохранить',
      confirmSelect: 'Подтвердите выбор',
      confirmTable: 'Вы действительно хотите занять стол ',
      selectTable: 'Выберите стол',
      workPlace: 'Рабочее место',
      getQueue: 'Заказать товар',
      productOnWay: 'Товар в пути',
      receivedProduct: 'Товар получен',
      auth: 'Авторизация',
      badgeNumber: 'Введите номер бейджа',
      login: 'Войти',

    },
    en: {
      logout: 'Log out',
      askLogout: 'Are you sure you want to leave the workstation?',
      logoutTitle: 'Leave Workstation',
      somethingWentWrong: 'An unexpected error occurred. Please try again.',
      cancel: 'Cancel',
      apply: 'Apply',
      enterName: 'Enter your name',
      yourName: 'Your name',
      save: 'Save',
      confirmSelect: 'Confirm selection',
      confirmTable: 'Are you sure you want to take the table ',
      selectTable: 'Select a table',
      workPlace: 'Workplace',
      getQueue: 'Request item',
      productOnWay: 'Product on the way',
      receivedProduct: 'Product received',
      auth: 'Authorization',
      badgeNumber: 'Enter badge number',
      login: 'Login',
    },
    ko: {
      logout: '로그아웃',
      askLogout: '작업 공간을 떠나시겠습니까?',
      logoutTitle: '작업 공간 나가기',
      somethingWentWrong: '예기치 않은 오류가 발생했습니다. 다시 시도해 주세요.',
      cancel: '취소',
      apply: '적용',
      enterName: '이름을 입력하세요',
      yourName: '당신의 이름',
      save: '저장',
      confirmSelect: '선택을 확인하세요',
      confirmTable: '이 테이블을 선택하시겠습니까 ',
      selectTable: '테이블을 선택하세요',
      workPlace: '작업 장소',
      getQueue: '상품 요청',
      productOnWay: '상품 이동 중',
      receivedProduct: '상품 수령됨',
      auth: '인증',
      badgeNumber: '배지 번호를 입력하세요',
      login: '로그인',
    }
  }
});

const availableLocales = computed(() => {
  const availableLocales = ['ru', 'en', 'ko'];
  return availableLocales.filter((l) => {
    return l != locale.value
  })
})

function changeLang(lang: 'ru' | 'ko' | 'en' = 'ru') {
  locale.value = lang;
  localStorage.setItem('lang', lang);
}

onMounted(() => {
  store.checkAuth()
  if(localStorage.getItem('lang')){
    changeLang(localStorage.getItem('lang') as 'ru' | 'en' | 'ko')
  }
})


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