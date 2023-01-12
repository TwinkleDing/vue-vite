import { setStore, getStore, removeStore } from "@/utils/storage"
import { UserInfo } from "@/utils/interface"

const user = {
    state: {
        userInfo:
            getStore({
                name: "userInfo"
            }) || {},
        token:
            getStore({
                name: "token"
            }) || {}
    },
    mutations: {
        /**
         * 设置用户信息
         */
        SET_USER_INFO(state: any, userInfo: UserInfo) {
            state.userInfo = userInfo
            console.log('set')
            setStore({
                name: "userInfo",
                content: userInfo
            })
        },
        /**
         * 移除用户信息
         */
        REMOVE_USER_INFO(state: any) {
            state.userInfo = {}
            removeStore({
                name: "userInfo"
            })
        },
        SET_TOKEN(state: any, token: string) {
            state.token = token
            setStore({
                name: "token",
                content: token
            })
        },
        REMOVE_TOKEN(state: any) {
            state.token = ""
            removeStore({
                name: "token"
            })
        }
    },
    actions: {}
}
export default user
