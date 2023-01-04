import { RouterItem } from "@/utils/interface"

const routeList: RouterItem[] = [
    {
        path: "/home",
        name: "home",
        meta: {
            label: "首页",
            icon: "Help",
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
            icon: "Menu",
            permission: true
        },
        children: [
            {
                path: "/nested1",
                name: "nested1",
                redirect: "/tableTest",
                meta: {
                    label: "嵌套路由1",
                    icon: "Menu",
                    permission: true
                },
                children: [
                    {
                        path: "/tableTest",
                        name: "tableTest",
                        meta: {
                            label: "表格测试",
                            icon: "Coordinate",
                            permission: true
                        },
                        component: "tableTest"
                    },
                    {
                        path: "/systemLog",
                        name: "systemLog",
                        meta: {
                            label: "系统日志",
                            icon: "Coordinate",
                            permission: true
                        },
                        component: "systemLog"
                    }
                ]
            },
            {
                path: "/nested2",
                name: "nested2",
                meta: {
                    label: "嵌套路由2",
                    icon: "Coordinate",
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
            icon: "Histogram",
            permission: true
        },
        component: "charts"
    },
    {
        path: "/model",
        name: "model",
        meta: {
            label: "模型预览",
            icon: "School",
            permission: true
        },
        component: "model"
    },
    {
        path: "/permission",
        name: "permission",
        meta: {
            label: "角色权限",
            icon: "Setting",
            permission: true
        },
        component: "permission"
    },
    {
        path: "/my",
        name: "my",
        meta: {
            label: "我的信息",
            icon: "Postcard",
            permission: true
        },
        component: "my"
    },
    {
        path: "/d3",
        name: "d3",
        meta: {
            label: "d3",
            icon: "PieChart",
            permission: true
        },
        component: "d3"
    },
    {
        path: "/canvas",
        name: "canvas",
        meta: {
            label: "canvas",
            icon: "Opportunity",
            permission: true
        },
        component: "canvas"
    },
    {
        path: "/media",
        name: "media",
        meta: {
            label: "media",
            icon: "VideoCameraFilled",
            permission: true
        },
        component: "media"
    }
]

export default routeList
