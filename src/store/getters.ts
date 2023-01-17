import { UserInfo, RouterItem, SystemIcon } from "@/utils/interface"

const getters = {
    userInfo: (state: any): UserInfo => state.user.userInfo,
    token: (state: any): string => state.user.token,
    language: (state: any): string => state.settings.language,
    systemTheme: (state: any): string => state.settings.systemTheme,
    headerTheme: (state: any): string => state.settings.headerTheme,
    menuTheme: (state: any): string => state.settings.menuTheme,
    router: (state: any) => state.settings.router,
    currentRoute: (state: any): string => state.settings.currentRoute,
    routeHistory: (state: any): any => state.settings.routeHistory,
    routeList: (state: any): RouterItem[] => state.settings.routeList,
    systemIcon: (state: any): SystemIcon => state.settings.systemIcon,
    tabsShow: (state: any): boolean => state.settings.tabsShow,
    menuPosition: (state: any): boolean => state.settings.menuPosition,
    tabsType: (state: any): number => state.settings.tabsType,
    systemPosition: (state: any): string => state.settings.systemPosition
}
export default getters
