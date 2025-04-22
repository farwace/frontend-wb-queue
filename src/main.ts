import './assets/main.css'
import 'izitoast/dist/css/iziToast.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import {i18n} from "@/i18n.ts";

const app = createApp(App)

app.use(createPinia())
app.use(i18n);
app.mount('#app')
