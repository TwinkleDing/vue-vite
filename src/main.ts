import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/theme-chalk/index.css";
import "./css/index.css";
import route from "./router/index.ts";
import store from "./store/index.ts";

createApp(App).use(store).use(route).use(ElementPlus).mount("#app");
