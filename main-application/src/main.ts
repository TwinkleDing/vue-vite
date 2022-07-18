import { createApp } from "vue"
import App from "./App.vue"
import "element-plus/dist/index.css"
import route from "./router"
import store from "./store"
import i18n from "./lang"
import "./css/index.scss"
import startQiankun from "./micro"
startQiankun()
createApp(App).use(i18n).use(store).use(route).mount("#MainApp")
