import { setStore, getStore, removeStore } from "@/utils/storage"
import router from "@/router"
import { UserInfo } from "@/utils/interface"
import { lighten } from "@/utils/themeColor"
import routeList from "@/router/routeList"
import { RouterItem } from "@/utils/interface"

const common = {
    state: {
        language:
            getStore({
                name: "language"
            }) || "zh",
        themeColor:
            getStore({
                name: "themeColor"
            }) || "#007dff",
        userInfo:
            getStore({
                name: "userInfo"
            }) || {},
        routeHistory: getStore({
            name: "routeHistory"
        }) || [
            {
                label: "首页",
                path: "/home"
            }
        ],
        routeList:
            getStore({
                name: "routeList"
            }) || routeList,
        systemIcon:
            getStore({
                name: "systemIcon"
            }) || null
    },
    mutations: {
        SET_LANGUAGE: (state: any, language: string) => {
            state.language = language
            var head = document.getElementsByTagName("head")[0]
            for (let i in head.children) {
                if (head.children[i].attributes) {
                    if (head.children[i].attributes[0]) {
                        if (head.children[i].attributes[0].name === "href") {
                            if (head.children[i].attributes[0].value.includes("public.css")) {
                                head.removeChild(head.children[i])
                            }
                        }
                    }
                }
            }
            if (language === "fan") {
                loadStyles("../../css/ar_public.css")
            } else {
                loadStyles("../../css/public.css")
            }

            function loadStyles(url: string) {
                var link = document.createElement("link")
                link.rel = "stylesheet"
                link.type = "text/css"
                link.href = url
                head.appendChild(link)
            }
            setStore({
                name: "language",
                content: state.language
            })
        },
        SET_THEME_COLOR(state: any, color: string) {
            state.themeColor = color
            let attribute = ""
            attribute += `--systemThemeColor: ${color};`
            let result = lighten(color, 58)
            attribute += `--systemThemeColorActive: ${result};`
            const root: any = document.querySelector(":root")
            if (root) {
                root.setAttribute("style", attribute)
            }
            setStore({
                name: "themeColor",
                content: color
            })
        },
        SET_USER_INFO(state: any, userInfo: UserInfo) {
            state.userInfo = userInfo
            setStore({
                name: "userInfo",
                content: state.userInfo
            })
        },
        REMOVE_USER_INFO(state: any) {
            state.userInfo = {}
            removeStore({
                name: "userInfo"
            })
        },
        SET_ROUTE_HISTORY(state: any, to: any) {
            if (Array.isArray(to)) {
                state.routeHistory = to
                setStore({
                    name: "routeHistory",
                    content: state.routeHistory
                })
                return
            }
            const history: any = state.routeHistory ? state.routeHistory : []
            let repeat: boolean = false
            history.forEach((item: any) => {
                if (item.path.includes(to.path)) {
                    repeat = true
                }
            })
            if (!repeat) {
                state.routeHistory = [
                    ...history,
                    {
                        label: to.meta.label,
                        path: to.path
                    }
                ]
                setStore({
                    name: "routeHistory",
                    content: state.routeHistory
                })
            }
        },
        REMOVE_ROUTE_HISTORY(state: any, index: number) {
            const history = state.routeHistory.splice(index, 1)
            if (!state.routeHistory.length) {
                state.routeHistory = [
                    {
                        label: "首页",
                        path: "/home"
                    }
                ]
            }
            if (history[0].path === router.currentRoute.value.path) {
                router.push(state.routeHistory[state.routeHistory.length - 1].path)
            }
            setStore({
                name: "routeHistory",
                content: state.routeHistory
            })
        },
        SET_ROUTE_LIST(state: any, list: any) {
            state.routeList = list
            setStore({
                name: "routeList",
                content: state.routeList
            })
        },
        SET_SYSTEM_ICON_POSITION(state: any, position: any) {
            state.systemIcon = position
            setStore({
                name: "systemIcon",
                content: state.systemIcon
            })
        }
    },
    actions: {
        router() {
            return new Promise((resolve: any) => {
                resolve(routeList)
            })
        },
        getRouteList(context: any) {
            return new Promise((resolve: any) => {
                const list = getStore({ name: "routeList" })
                    ? getStore({ name: "routeList" })
                    : routeList
                context.commit("SET_ROUTE_LIST", list)
                resolve(list)
            })
        }
    }
}
export default common
