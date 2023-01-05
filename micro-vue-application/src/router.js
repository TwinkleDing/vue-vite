import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
	routes: [
		{
			path: "/",
			redirect: "/home",
		},
		{
			path: "/home",
			component: () => import("@/view/home.vue"),
		},
		{
			path: "/first",
			name: "first",
			component: () => import("@/view/first.vue"),
		},
		{
			path: "/second",
			name: "second",
			component: () => import("@/view/second.vue"),
		},
	],
	history: createWebHistory(window.__POWERED_BY_QIANKUN__ ? "/MicroVue" : "/"),
	scrollBehavior(to, from, savedPosition) {
		const scrollBehavior = {
			el: "#layout-main",
			top: savedPosition ? savedPosition.top : 0,
			left: savedPosition ? savedPosition.left : 0,
			behavior: "smooth",
		};

		return new Promise((resolve, reject) => {
			setTimeout(() => {
				const el = document.getElementById("layout-main");

				el && el.scrollTo(scrollBehavior);
				resolve();
			}, 200);
		});
	},
});

export default router;
