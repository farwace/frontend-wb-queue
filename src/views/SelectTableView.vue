<template>
  <div>
    <Confirm
        v-if="confirmSelect"
        :title="'Подтвердите выбор'"
        :message="'Вы действительно хотите занять стол ' + confirmSelectTableName + '?'"
        @accept="applySelect(confirmSelectTableId)"
        @cancel="confirmSelect = false;"
    />
    <h2>{{ user?.name ? (user.name + ', ') : '' }} Выберите стол</h2>
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
</script>