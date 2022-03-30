import { RouterItem } from "@/utils/interface"

const routeList: RouterItem[] = [
    {
        path: "/home",
        name: "home",
        meta: {
            label: "首页"
        },
        component: "home"
    },
    {
        path: "/nested",
        name: "nested",
        redirect: "/nested1",
        meta: {
            label: "嵌套路由"
        },
        children: [
            {
                path: "/nested1",
                name: "nested1",
                redirect: "/nested11",
                meta: {
                    label: "嵌套路由1"
                },
                children: [
                    {
                        path: "/nested11",
                        name: "nested11",
                        meta: {
                            label: "嵌套路由1-1"
                        },
                        component: "nested11"
                    },
                    {
                        path: "/nested12",
                        name: "nested12",
                        meta: {
                            label: "嵌套路由1-2"
                        },
                        component: "nested12"
                    }
                ]
            },
            {
                path: "/nested2",
                name: "nested2",
                meta: {
                    label: "嵌套路由2"
                },
                component: "nested2"
            }
        ]
    },
    {
        path: "/charts",
        name: "charts",
        meta: {
            label: "图表"
        },
        component: "charts"
    },
    {
        path: "/system",
        name: "system",
        redirect: "/permission",
        meta: {
            label: "系统设置"
        },
        children: [
            {
                path: "/permission",
                name: "permission",
                meta: {
                    label: "角色权限"
                },
                component: "permission"
            }
        ]
    },
    {
        path: "/model",
        name: "model",
        meta: {
            label: "模型"
        },
        component: "model"
    }
]

export default routeList
