const getters = {
    language: (state: any) => state.settings.language,
    userInfo: (state: any) => state.user.userInfo,
    systemTheme: (state: any) => state.settings.systemTheme,
    headerTheme: (state: any) => state.settings.headerTheme,
    menuTheme: (state: any) => state.settings.menuTheme,
    router: (state: any) => state.settings.router,
    currentRoute: (state: any) => state.settings.currentRoute,
    routeHistory: (state: any) => state.settings.routeHistory,
    routeList: (state: any) => state.settings.routeList,
    systemIcon: (state: any) => state.settings.systemIcon,
    tabsShow: (state: any) => state.settings.tabsShow,
    menuPosition: (state: any) => state.settings.menuPosition,
    tabsType: (state: any) => state.settings.tabsType
}
export default getters
