import { createApp } from "vue"
import Particles from "vue3-particles";
import App from "./App.vue"
import route from "./router"
import store from "./store"
import i18n from "./lang"
import "./css/index.scss"

createApp(App).use(i18n).use(store).use(route).use(Particles).mount("#app")
