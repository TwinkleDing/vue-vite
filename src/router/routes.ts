import { RouterItem } from "@/utils/interface"

const routes: RouterItem[] = [
    {
        path: "/",
        name: "index",
        redirect: "/index"
    },
    {
        path: "/index",
        name: "index",
        component: () => import(/* webpackChunkName: 'dashboard' */ "@/pages/dashboard/index.vue")
    },
    {
        path: "/login",
        name: "login",
        component: () => import(/* webpackChunkName: 'login' */ "@/pages/login/index.vue")
    }
]

export default routes
