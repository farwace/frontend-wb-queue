<template>
  <div>
    <Confirm
        v-if="confirmSelect"
        :title="t('confirmSelect')"
        :message="t('confirmTable') + confirmSelectTableName + '?'"
        @accept="applySelect(confirmSelectTableId)"
        @cancel="confirmSelect = false;"
    />
    <h2>{{ user?.name ? (user.name + ', ') : '' }} {{t('selectTable')}}</h2>
    <ul>
      <li v-for="t in store.user?.tables" :key="t.id">
        <button @click="select(t.id, t.name)">{{ t.name }}</button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '../stores/user'
import {storeToRefs} from "pinia";
import {ref} from "vue";
import Confirm from "@/components/Confirm.vue";
import {useI18n} from "vue-i18n";

const { user } = storeToRefs(useUserStore());

const store = useUserStore()

const confirmSelect = ref<boolean>(false);
const confirmSelectTableId = ref<number>();
const confirmSelectTableName = ref<string>();



const select = async (id: number, name?:string) => {
  confirmSelect.value = true;
  confirmSelectTableId.value = id;
  confirmSelectTableName.value = name;
}
const applySelect = async (id?: number) => {
  confirmSelect.value = false;
  if(id){
    await store.selectTable(id)
  }
}

const {t, locale} = useI18n();
</script>