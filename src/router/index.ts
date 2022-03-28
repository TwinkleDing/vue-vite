import { createRouter, createWebHashHistory } from "vue-router"
import store from "@/store"
import Empty from "@/pages/Empty.vue"

let firstGetRoute = false
const _importComponent = (file) => () => import(`../views/${file}/index.vue`)

const router: any = new (createRouter as any)({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            name: "dashboard",
            redirect: "/index"
        },
        {
            path: "/index",
            name: "index",
            component: () =>
                import(/* webpackChunkName: 'dashboard' */ "@/pages/dashboard/index.vue")
        },
        {
            path: "/login",
            name: "login",
            component: () => import(/* webpackChunkName: 'login' */ "@/pages/login/index.vue")
        },
        {
            path: "/404", //重定向
            name: "404",
            component: () => import("@/pages/notFound.vue")
        }
    ]
})

router.beforeEach(async (to: any) => {
    if (!firstGetRoute && store.getters.userInfo.userId) {
        firstGetRoute = true
        const list = await store.dispatch("router")
        const routerList = filterAsyncRouter(list)
        routerList.map((item: RouterItem[]) => {
            router.addRoute("index", item)
        })

        return to.fullPath
    } else if (to.fullPath.includes("login")) {
        store.commit("REMOVE_USER_INFO")
    } else if (!store.getters.userInfo.userId) {
        return "/login"
    } else {
        // 添加路由到路有记录
        store.commit("SET_ROUTE_HISTORY", to)
    }
})

//遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap: RouterItem[]) {
    const accessedRouters = asyncRouterMap.filter((route: RouterItem) => {
        if (route.component) {
            route.component = _importComponent(route.component)
        } else {
            route.component = Empty
        }
        if (route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children)
        }
        return true
    })
    return accessedRouters
}

export default router
