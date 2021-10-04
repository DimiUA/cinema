import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import PrimeVue from 'primevue/config';

import "primeflex/primeflex.css";
import 'primevue/resources/themes/saga-blue/theme.css'       //theme
import 'primevue/resources/primevue.min.css'                 //core css
import 'primeicons/primeicons.css'                          //icons

import "@/css/app.scss"

createApp(App)
  .use(router)
  .use(store)
  .use(PrimeVue)
  .mount('#app')
