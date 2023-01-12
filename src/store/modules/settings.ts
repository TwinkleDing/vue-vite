import { setStore, getStore, removeStore } from "@/utils/storage"
import router from "@/router"
import { lighten, addElementPlusColor } from "@/utils/themeColor"
import { RouterItem, SystemIcon } from "@/utils/interface"
import routeList from "@/router/routeList"
import { routerApi } from "@/api/commonApi"
import {
    APP_PRESET_COLOR_LIST,
    HEADER_PRESET_BG_COLOR_LIST,
    SIDE_BAR_BG_COLOR_LIST
} from "@/settings/designSetting"

const settings = {
    state: {
        language:
            getStore({
                name: "language"
            }) || "zh",
        systemTheme:
            getStore({
                name: "systemTheme"
            }) || APP_PRESET_COLOR_LIST[0],
        headerTheme:
            getStore({
                name: "headerTheme"
            }) || HEADER_PRESET_BG_COLOR_LIST[0],
        menuTheme:
            getStore({
                name: "menuTheme"
            }) || SIDE_BAR_BG_COLOR_LIST[0],
        tabsShow:
            getStore({
                name: "tabsShow"
            }) === undefined
                ? true
                : getStore({ name: "tabsShow" }),
        tabsType:
            getStore({
                name: "tabsType"
            }) === undefined
                ? 1
                : getStore({ name: "tabsType" }),
        menuPosition:
            getStore({
                name: "menuPosition"
            }) === undefined
                ? true
                : getStore({ name: "menuPosition" }),
        routeHistory: getStore({
            name: "routeHistory"
        }) || [
            {
                label: "home",
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
            }) || null,
        currentRoute:
            getStore({
                name: "currentRoute"
            }) || null
    },
    mutations: {
        /**
         * 设置语言/正反向语言
         */
        SET_LANGUAGE: (state: any, language: string): void => {
            state.language = language
            const head = document.getElementsByTagName("head")[0]
            const linkTags = head.getElementsByTagName("link")
            for (let i of linkTags) {
                if (i.attributes) {
                    for (let j of i.attributes) {
                        "object" === typeof j &&
                            j.value.includes("public.css") &&
                            head.removeChild(i)
                    }
                }
            }
            if (language === "en") {
                loadStyles("../../css/ar_public.css")
            } else {
                loadStyles("../../css/public.css")
            }

            function loadStyles(url: string) {
                var link = document.createElement("link")
                link.href = url
                link.rel = "stylesheet"
                link.type = "text/css"
                head.appendChild(link)
            }
            setStore({
                name: "language",
                content: state.language
            })
        },
        /**
         * 设置系统颜色
         */
        SET_SYSTEM_THEME(state: any, color: string): void {
            state.systemTheme = color
            ;(this as any).commit("SET_ALL_THEME_COLOR")
            setStore({
                name: "systemTheme",
                content: color
            })
        },
        /**
         * 设置顶部颜色
         */
        SET_HEADER_THEME(state: any, color: string): void {
            state.headerTheme = color
            ;(this as any).commit("SET_ALL_THEME_COLOR")
            setStore({
                name: "headerTheme",
                content: color
            })
        },
        /**
         * 设置菜单颜色
         */
        SET_MENU_THEME(state: any, color: string): void {
            state.menuTheme = color
            ;(this as any).commit("SET_ALL_THEME_COLOR")
            setStore({
                name: "menuTheme",
                content: color
            })
        },
        /**
         * 设置标签页是否想展示
         */
        SET_TABS_SHOW(state: any, status: boolean): void {
            state.tabsShow = status
            setStore({
                name: "tabsShow",
                content: status
            })
        },
        /**
         * 设置标签页样式
         */
        SET_TABS_TYPE(state: any, value: number): void {
            state.tabsType = value
            setStore({
                name: "tabsType",
                content: value
            })
        },
        /**
         * 设置菜单的位置
         */
        SET_MENU_POSITION(state: any, status: boolean): void {
            state.menuPosition = status
            setStore({
                name: "menuPosition",
                content: status
            })
        },
        /**
         * 设置路由历史
         */
        SET_ROUTE_HISTORY(state: any, to: any): void {
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
                        label: to.name,
                        path: to.path
                    }
                ]
                setStore({
                    name: "routeHistory",
                    content: state.routeHistory
                })
            }
        },
        /**
         * 移除指定路由历史
         */
        REMOVE_ROUTE_HISTORY_INDEX(state: any, index: number): void {
            const history = state.routeHistory.splice(index, 1)
            if (!state.routeHistory.length) {
                state.routeHistory = [
                    {
                        label: "home",
                        path: "/home"
                    }
                ]
            }
            if (history[0].path === router.currentRoute.value.path) {
                router.push(state.routeHistory[index - 1].path)
            }
            setStore({
                name: "routeHistory",
                content: state.routeHistory
            })
        },
        /**
         * 移除全部路由历史
         */
        REMOVE_ROUTER_HISTORY(state: any): void {
            state.routeHistory = [
                {
                    label: "home",
                    path: "/home"
                }
            ]
            removeStore({
                name: "routeHistory"
            })
        },
        /**
         * 设置路由列表
         */
        SET_ROUTE_LIST(state: any, list: RouterItem[]): void {
            state.routeList = list
            setStore({
                name: "routeList",
                content: state.routeList
            })
        },
        /**
         * 移除路由列表
         */
        REMOVE_ROUTER_LIST(state: any): void {
            state.routeList = []
            removeStore({
                name: "routeList"
            })
        },
        /**
         * 设置系统设置icon位置
         */
        SET_SYSTEM_ICON_POSITION(state: any, position: SystemIcon): void {
            state.systemIcon = position
            setStore({
                name: "systemIcon",
                content: state.systemIcon
            })
        },
        /**
         * 颜色设置
         */
        SET_ALL_THEME_COLOR(state: any): void {
            let attribute = ""
            attribute += `--systemThemeColor: ${state.systemTheme};`
            attribute += `--systemThemeColorActive: ${lighten(state.systemTheme, 30)};`
            attribute += `--headerThemeColor: ${state.headerTheme};`
            attribute += `--headerThemeColorActive: ${lighten(state.headerTheme, 30)};`
            attribute += `--menuThemeColor: ${state.menuTheme};`
            attribute += `--menuThemeColorActive: ${lighten(state.menuTheme, 30)};`
            // 添加elementui的主题颜色
            attribute += addElementPlusColor(state.systemTheme)
            const root: any = document.querySelector(":root")
            if (root) {
                root.setAttribute("style", attribute)
            }
        },
        /**
         * 设置当前路由
         */
        SET_CURRENT_ROUTE(state: any, route: any): void {
            state.currentRoute = route
        }
    },
    actions: {
        /**
         * 设置动态路由
         */
        router() {
            return new Promise((resolve: any): void => {
                resolve(routeList)
            })
        },
        /**
         * 获取路由列表
         */
        getRouteList(context: any) {
            return new Promise((resolve: any, reject: any) => {
                if (context.getters.userInfo.type === "tourist") {
                    context.state.routeList = [...routeList]
                    context.commit("SET_ROUTE_LIST", context.state.routeList)
                    resolve(context.state.routeList)
                } else {
                    routerApi().then((res: any) => {
                        if (Array.isArray(res.data)) {
                            context.state.routeList = [...res.data]
                            context.commit("SET_ROUTE_LIST", context.state.routeList)
                            resolve(context.state.routeList)
                        } else {
                            reject([])
                        }
                    })
                }
            })
        },
        /**
         * 移除所有非必要信息
         */
        removeAll(context: any): void {
            context.commit("REMOVE_ROUTER_LIST")
            context.commit("REMOVE_USER_INFO")
        }
    }
}
export default settings
