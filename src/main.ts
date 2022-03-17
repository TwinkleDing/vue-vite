import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import Particles from "particles.vue3";

import "./css/index.scss";
import route from "./router/index.ts";
import store from "./store/index.ts";
import i18n from "./lang";

createApp(App)
    .use(i18n)
    .use(store)
    .use(route)
    .use(ElementPlus)
    .use(Particles)
    .mount("#app");
