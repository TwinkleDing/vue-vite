import { createApp, h } from "vue";
import App from "./App.vue";
import "./public-path.js";
import router from "./router";
import store from "./store";
import "./public-path";
let instance = null;

import { renderWithQiankun } from "vite-plugin-qiankun/dist/helper";

renderWithQiankun({
	mount() {
		console.log("MicroVueApp Mount");
		render();
	},
	bootstrap() {
		console.log("MicroVueApp Bootstrap");
	},
	unmount() {
		console.log("MicroVueApp Unmount");
		instance.unmount();
		instance = null;
	},
});

/**
 * 渲染函数
 * 两种情况：主应用生命周期钩子中运行 / 微应用单独启动时运行
 */
function render() {
	const app = createApp({
		mounted() {},
		render: () => h(App),
	});
	app.use(router).use(store).mount("#MicroVueApp");
	instance = app;
}

// 独立运行时，直接挂载应用
if (!window.__POWERED_BY_QIANKUN__) {
	render();
}
