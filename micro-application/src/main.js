import {
    createApp
} from 'vue'
import App from './App.vue'
import './public-path.js';
import router from "./router"
import store from "./store"
let instance = null;

import {
    renderWithQiankun,
    qiankunWindow
} from 'vite-plugin-qiankun/dist/helper';


renderWithQiankun({
    mount(props) {
        console.log("qiankun-mount", props);
        render(props);
    },
    bootstrap() {
        console.log("%c ", "color: green;", "sub-vite2-vue3 app bootstraped");
    },
    unmount(props) {
        console.log("qiankun-unmount");
        instance.unmount();
        instance = null;
    },
});

/**
 * 渲染函数
 * 两种情况：主应用生命周期钩子中运行 / 微应用单独启动时运行
 */
function render() {
    const app = createApp(App).use(router).use(store).mount('#MicroApp');
    instance = app;
}

// 独立运行时，直接挂载应用
if (!window.__POWERED_BY_QIANKUN__) {
    console.log(123);
    render();
}
