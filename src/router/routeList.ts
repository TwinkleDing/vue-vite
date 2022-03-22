import { RouterItem } from "@/utils/interface"

const routeList: RouterItem[] = [
    {
        path: "/menu1",
        name: "menu1",
        meta: {
            label: "菜单一"
        },
        component: () => import(/* webpackChunkName: 'home' */ "@/views/home.vue")
    },
    {
        path: "/menu2",
        name: "menu2",
        meta: {
            label: "菜单二"
        },
        component: () => import(/* webpackChunkName: 'home' */ "@/views/home.vue"),
        children: [
            {
                path: "/menu21",
                name: "menu21",
                meta: {
                    label: "菜单二一"
                },
                component: () => import(/* webpackChunkName: 'home' */ "@/views/home.vue"),
                children: [
                    {
                        path: "/menu211",
                        name: "menu211",
                        meta: {
                            label: "菜单二一一"
                        },
                        component: () => import(/* webpackChunkName: 'home' */ "@/views/home.vue")
                    },
                    {
                        path: "/menu212",
                        name: "menu212",
                        meta: {
                            label: "菜单二一二"
                        },
                        component: () => import(/* webpackChunkName: 'home' */ "@/views/home.vue")
                    }
                ]
            },
            {
                path: "/menu22",
                name: "menu22",
                meta: {
                    label: "菜单二二"
                },
                component: () => import(/* webpackChunkName: 'home' */ "@/views/home.vue")
            }
        ]
    },
    {
        path: "/menu3",
        name: "menu3",
        meta: {
            label: "菜单三"
        },
        component: () => import(/* webpackChunkName: 'home' */ "@/views/home.vue")
    },
    {
        path: "/menu4",
        name: "menu4",
        meta: {
            label: "菜单四"
        },
        component: () => import(/* webpackChunkName: 'home' */ "@/views/home.vue")
    },
    {
        path: "/menu5",
        name: "menu5",
        meta: {
            label: "菜单五"
        },
        component: () => import(/* webpackChunkName: 'home' */ "@/views/home.vue")
    }
]

export default routeList
