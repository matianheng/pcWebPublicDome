import { createApp } from 'vue'
import App from '@/App.vue'
import 'virtual:svg-icons-register'
import '@/assets/scss/index.scss'
import { createPinia } from 'pinia'
import router from '@/routes/index'
import piniaPersist from 'pinia-plugin-persist'
import { i18n } from './i18n'
import { setupAjax } from '@/utils/ajax/AjaxUtil'
import '@/utils/ResizeObserverFix'
import '@/components/lsy/check-update/CheckUpdateController.ts'

const app = createApp(App)
const pinia = createPinia()
// piniaPersist使用详见: https://juejin.cn/post/7139002338554937352
pinia.use(piniaPersist)

app.use(i18n)
app.use(pinia)
app.use(router)

setupAjax(app)
app.mount('#app')
