import { shallowRef } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import store from "@/store"
import Empty from "@/pages/Empty.vue"
import { RouterItem } from "@/utils/interface"

let firstGetRoute = true
const _importComponent = (file: string) => () => import(`../views/${file}/index.vue`)

const router: any = new (createRouter as any)({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "dashboard",
            redirect: "/home",
            component: Empty
        },
        {
            path: "/index",
            name: "index",
            redirect: "/home",
            component: Empty
        },
        {
            path: "/login",
            name: "login",
            component: () => import(/* webpackChunkName: 'login' */ "@/pages/login/index.vue")
        }
        // {
        //     path: "/:cathchAll(.*)",
        //     name: "404",
        //     component: () => import("@/pages/notFound.vue")
        // }
    ]
})

router.beforeEach(async (to: any) => {
    if (to.fullPath.includes("login")) {
        store.commit("REMOVE_USER_INFO")
    } else if (firstGetRoute && store.getters.userInfo.userName) {
        firstGetRoute = false
        const list = [...(await store.dispatch("getRouteList"))]
        const routerList = [...filterAsyncRouter(list)]
        routerList.map((item: RouterItem) => {
            router.addRoute("index", item)
        })
        return to.fullPath
    } else if (!store.getters.userInfo.userName) {
        store.dispatch("removeAll")
        return "/login"
    } else {
        // 手动设置这两个属性，不然react子项目切换至其他会报错
        if (!window.history.state.current) {
            window.history.state.current = to.fullPath
        }
        if (!window.history.state.back) {
            window.history.state.back = to.fullPath
        }
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
