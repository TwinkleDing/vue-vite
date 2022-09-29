import { setStore, getStore, removeStore } from "@/utils/storage"
import router from "@/router"
import { lighten } from "@/utils/themeColor"
import routeList from "@/router/routeList"
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
        SET_SYSTEM_THEME(state: any, color: string) {
            state.systemTheme = color
            this.commit("SET_ALL_THEME_COLOR")
            setStore({
                name: "systemTheme",
                content: color
            })
        },
        SET_HEADER_THEME(state: any, color: string) {
            state.headerTheme = color
            this.commit("SET_ALL_THEME_COLOR")
            setStore({
                name: "headerTheme",
                content: color
            })
        },
        SET_MENU_THEME(state: any, color: string) {
            state.menuTheme = color
            this.commit("SET_ALL_THEME_COLOR")
            setStore({
                name: "menuTheme",
                content: color
            })
        },
        SET_TABS_SHOW(state: any, status: boolean) {
            state.tabsShow = status
            setStore({
                name: "tabsShow",
                content: status
            })
        },
        SET_TABS_TYPE(state: any, value: number) {
            state.tabsType = value
            setStore({
                name: "tabsType",
                content: value
            })
        },
        SET_MENU_POSITION(state: any, status: boolean) {
            state.menuPosition = status
            setStore({
                name: "menuPosition",
                content: status
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
        REMOVE_ROUTE_HISTORY(state: any, index: number) {
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
        },
        SET_ALL_THEME_COLOR(state: any) {
            let attribute = ""
            attribute += `--systemThemeColor: ${state.systemTheme};`
            attribute += `--systemThemeColorActive: ${lighten(state.systemTheme, 30)};`
            attribute += `--headerThemeColor: ${state.headerTheme};`
            attribute += `--headerThemeColorActive: ${lighten(state.headerTheme, 30)};`
            attribute += `--menuThemeColor: ${state.menuTheme};`
            attribute += `--menuThemeColorActive: ${lighten(state.menuTheme, 30)};`
            const root: any = document.querySelector(":root")
            if (root) {
                root.setAttribute("style", attribute)
            }
        },
        REMOVE_ROUTER_LIST(state: any) {
            state.routeList = []
            removeStore({
                name: "routeList"
            })
        },
        SET_CURRENT_ROUTE(state: any, route: any) {
            state.currentRoute = route
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
export default settings
