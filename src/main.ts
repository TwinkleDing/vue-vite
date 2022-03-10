import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/theme-chalk/index.css";
import "./css/index.less";
import route from "./router/index.ts";
import store from "./store/index.ts";
import i18n from "./lang";

createApp(App).use(i18n).use(store).use(route).use(ElementPlus).mount("#app");
