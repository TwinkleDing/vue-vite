import { RouterItem } from "@/utils/interface"

const routeList: RouterItem[] = [
    {
        path: "/home",
        name: "home",
        meta: {
            label: "首页"
        },
        component: "index",
    },
    {
        path: "/menu2",
        name: "menu2",
        meta: {
            label: "菜单二"
        },
        component: "home",
        children: [
            {
                path: "/menu21",
                name: "menu21",
                meta: {
                    label: "菜单二一"
                },
                component: "home",
                children: [
                    {
                        path: "/menu211",
                        name: "menu211",
                        meta: {
                            label: "菜单二一一"
                        },
                        component: "home"
                    },
                    {
                        path: "/menu212",
                        name: "menu212",
                        meta: {
                            label: "菜单二一二"
                        },
                        component: "home"
                    }
                ]
            },
            {
                path: "/menu22",
                name: "menu22",
                meta: {
                    label: "菜单二二"
                },
                component: "home"
            }
        ]
    },
    {
        path: "/menu3",
        name: "menu3",
        meta: {
            label: "菜单三"
        },
        component: "home"
    },
    {
        path: "/menu4",
        name: "menu4",
        meta: {
            label: "菜单四"
        },
        component: "home"
    },
    {
        path: "/menu5",
        name: "menu5",
        meta: {
            label: "菜单五"
        },
        component: "home"
    }
]

export default routeList
