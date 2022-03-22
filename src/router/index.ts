import { createRouter, createWebHashHistory } from "vue-router"
import store from "@/store"
import Empty from "@/pages/Empty.vue"

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

var getRoute
// var _import = (file) => () => import("@/views/" + file + ".vue")
var _import = (file) => () => import("@/views/home.vue")

router.beforeEach(async (to: any) => {
    if (!getRoute) {
        getRoute = true
        const list = await store.dispatch("router")
        const routerList = filterAsyncRouter(list)
        routerList.map((item: RouterItem[]) => {
            router.addRoute("index", item)
        })

        return to.fullPath
    }
})

//遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap: any) {
    const accessedRouters = asyncRouterMap.filter((route: any) => {
        if (route.name === "Pages") {
            route.component = Pages
        } else {
            if (route.component) {
                route.component = _import(route.component)
            } else {
                route.component = Empty
            }
        }
        if (route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children)
        }
        return true
    })
    return accessedRouters
}

export default router
