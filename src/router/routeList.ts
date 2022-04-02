import { RouterItem } from "@/utils/interface"

const routeList: RouterItem[] = [
    {
        path: "/home",
        name: "home",
        meta: {
            label: "首页",
            permission: true
        },
        component: "home"
    },
    {
        path: "/nested",
        name: "nested",
        redirect: "/nested1",
        meta: {
            label: "嵌套路由",
            permission: true
        },
        children: [
            {
                path: "/nested1",
                name: "nested1",
                redirect: "/nested11",
                meta: {
                    label: "嵌套路由1",
                    permission: true
                },
                children: [
                    {
                        path: "/nested11",
                        name: "nested11",
                        meta: {
                            label: "嵌套路由1-1",
                            permission: true
                        },
                        component: "nested11"
                    },
                    {
                        path: "/nested12",
                        name: "nested12",
                        meta: {
                            label: "嵌套路由1-2",
                            permission: true
                        },
                        component: "nested12"
                    }
                ]
            },
            {
                path: "/nested2",
                name: "nested2",
                meta: {
                    label: "嵌套路由2",
                    permission: true
                },
                component: "nested2"
            }
        ]
    },
    {
        path: "/charts",
        name: "charts",
        meta: {
            label: "图表展示",
            permission: true
        },
        component: "charts"
    },
    {
        path: "/model",
        name: "model",
        meta: {
            label: "模型预览",
            permission: true
        },
        component: "model"
    },
    {
        path: "/permission",
        name: "permission",
        meta: {
            label: "角色权限",
            permission: true
        },
        component: "permission"
    },
    {
        path: "/my",
        name: "my",
        meta: {
            label: "我的信息",
            permission: true
        },
        component: "my"
    }
]

export default routeList
