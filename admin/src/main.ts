import { createApp } from 'vue'
import './styles/index.scss'
import App from './App.vue'

const app = createApp(App)

// 使用pinia插件
import pinia from './store/index'
app.use(pinia)
// 注册路由插件
import router from './router/index'
app.use(router)
// svg图标渲染
import 'virtual:svg-icons-register'
import GlobalComponent from '@/components/index'
app.use(GlobalComponent)





app.mount('#app')

