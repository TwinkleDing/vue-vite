import { shallowRef } from "vue"
import { createRouter, createWebHashHistory } from "vue-router"
import store from "@/store"
import Empty from "@/pages/Empty.vue"
import { RouterItem } from "@/utils/interface"

let firstGetRoute = true
const _importComponent = (file: string) => () => import(`../views/${file}/index.vue`)

const router: any = new (createRouter as any)({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            name: "dashboard",
            redirect: "/home"
        },
        {
            path: "/index",
            name: "index",
            redirect: "/home",
            component: () =>
                import(/* webpackChunkName: 'dashboard' */ "@/pages/dashboard/index.vue")
        },
        {
            path: "/login",
            name: "login",
            component: () => import(/* webpackChunkName: 'login' */ "@/pages/login/index.vue")
        },
        {
            path: "/:cathchAll(.*)",
            name: "404",
            component: () => import("@/pages/notFound.vue")
        }
    ]
})

router.beforeEach(async (to: any) => {
    if (firstGetRoute && store.getters.userInfo.userName) {
        firstGetRoute = false
        const list = [...(await store.dispatch("getRouteList"))]
        const routerList = [...filterAsyncRouter(list)]
        routerList.map((item: RouterItem) => {
            router.addRoute("index", item)
        })
        return to.fullPath
    } else if (to.fullPath.includes("login")) {
        store.commit("REMOVE_USER_INFO")
    } else if (!store.getters.userInfo.userName) {
        store.dispatch("removeAll")
        return "/login"
    } else {
        // 添加路由到路有记录
        store.commit("SET_CURRENT_ROUTE", to)
        store.commit("SET_ROUTE_HISTORY", to)
    }
})

//遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap: RouterItem[]) {
    const accessedRouters = asyncRouterMap.filter((route: RouterItem) => {
        if (route.component) {
            route.component = _importComponent(route.component)
        } else {
            route.component = shallowRef(Empty)
        }
        if (route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children)
        }
        return true
    })
    return accessedRouters
}

export default router
