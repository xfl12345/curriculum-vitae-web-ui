import { createApp } from 'vue'
import { directive } from 'resize-observer-vue'
import App from '@/App.vue'
import { createPinia } from 'pinia'
import i18n from '@/i18n'
import router from '@/router'
import axios from 'axios'
import { isUndefinedOrNull } from '@/components/xfl-common/ts/IsUndefinedOrNull'

// import "./assets/css/font.css";

let htmlLinkElement = <HTMLLinkElement>document.head.querySelector('link[rel*="icon"]')
if (isUndefinedOrNull(htmlLinkElement)) {
  htmlLinkElement = document.createElement('link')
  htmlLinkElement.type = 'image/x-icon'
  // 空白 1px 图片
  htmlLinkElement.href =
    'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=='
  document.head.appendChild(htmlLinkElement)
}

axios.head('./favicon.ico').then(
  (axiosResponse) => {
    if (axiosResponse.status === 200) {
      htmlLinkElement.href = './favicon.ico'
    }
  },
  (reason) => {
    htmlLinkElement.type = 'image/svg+xml'
    htmlLinkElement.href = './vue.svg'
  }
)

const app = createApp(App)
app.directive('resize', directive)
app.use(createPinia())
app.use(i18n)
app.use(router)
app.mount('#app')
