const getters = {
    language: (state: any) => state.common.language,
    userInfo: (state: any) => state.common.userInfo,
    systemTheme: (state: any) => state.common.systemTheme,
    headerTheme: (state: any) => state.common.headerTheme,
    menuTheme: (state: any) => state.common.menuTheme,
    router: (state: any) => state.common.router,
    currentRoute: (state: any) => state.common.currentRoute,
    routeHistory: (state: any) => state.common.routeHistory,
    routeList: (state: any) => state.common.routeList,
    systemIcon: (state: any) => state.common.systemIcon,
    tabsShow: (state: any) => state.common.tabsShow,
    menuPosition: (state: any) => state.common.menuPosition,
    tabsType: (state: any) => state.common.tabsType
}
export default getters
