import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import pinia from './store'
import router from './router'
import { useDragAndDrop } from "fluid-dnd/vue";
const app = createApp(App)
app.provide('useDragAndDrop', useDragAndDrop);
app.use(pinia)
app.use(router)
app.mount('#app')
