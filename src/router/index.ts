import { shallowRef } from "vue"
import { createRouter, createWebHashHistory } from "vue-router"
import store from "@/store"
import Empty from "@/pages/Empty.vue"
import { RouterItem } from "@/utils/interface"
const WHITE_PATH = ["/login", "/openai"]

let firstGetRoute: boolean = true
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
            path: "/openai",
            name: "openai",
            component: () => import(/* webpackChunkName: 'login' */ "@/views/openai/index.vue")
        },
        {
            path: "/:cathchAll(.*)",
            name: "404",
            component: () => import("@/pages/notFound.vue")
        }
    ]
})

router.beforeEach(async (to: any) => {
    if (WHITE_PATH.includes(to.path)) {
        store.commit("REMOVE_USER_INFO")
    } else if (firstGetRoute && store.getters.userInfo.userName) {
        firstGetRoute = false
        const routerList: RouterItem[] = [
            ...filterAsyncRouter(await store.dispatch("getRouteList"))
        ]
        routerList.map((item: RouterItem) => {
            router.addRoute("index", item)
        })
        return to.fullPath
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
function filterAsyncRouter(asyncRouterMap: RouterItem[]): RouterItem[] {
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
