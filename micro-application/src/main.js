import {
    createApp,
    h
} from 'vue'
import App from './App.vue'
import './public-path.js';
import router from "./router"
import store from "./store"

let instance = null;

/**
 * 渲染函数
 * 两种情况：主应用生命周期钩子中运行 / 微应用单独启动时运行
 */
function render() {
    const proxyPrefix =
        process.env.NODE_ENV === 'development' ?
        '/micro' :
        window.systemConfig.prod;
    const prefixPath =
        process.env.NODE_ENV === 'development' ?
        '/' :
        `${process.env.CONTEXT_ENV}`;

    window.api = {
        env: window.clientApi ? window.clientApi.env : process.env.DEPLOY_ENV,
        baseUrl: proxyPrefix,
        prefixPath: window.clientApi ? window.clientApi.prefixPath : prefixPath,
    };

    const app = createApp({
        mounted() {},
        render: () => h(App),
    });

    app.use(router).use(store).mount('#MicroApp');
    instance = app;
    app.config.errorHandler = (err, vm, info) => {
        app.config.globalProperties.$message.error('加载失败, 请刷新重试');
    };
    router.$app = app;
    window.$app = app;
    const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
    if (!isMac) {
        document.body.classList.add('customed-scrollbar');
    }
}

// 独立运行时，直接挂载应用
if (!window.__POWERED_BY_QIANKUN__) {
    render();
}

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
    console.log('VueMicroApp bootstraped');
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
    console.log('VueMicroApp mount', props);
    render(props);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
    console.log('VueMicroApp unmount');
    instance.unmount();
    instance = null;
}