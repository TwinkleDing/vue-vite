const getters = {
    language: (state: any) => state.common.language,
    userInfo: (state: any) => state.common.userInfo,
    themeColor: (state: any) => state.common.themeColor,
    router: (state: any) => state.common.router,
    routeHistory: (state: any) => state.common.routeHistory
}
export default getters
