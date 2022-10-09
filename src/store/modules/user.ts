import { setStore, getStore, removeStore } from "@/utils/storage"
import { UserInfo } from "@/utils/interface"

const user = {
    state: {
        userInfo:
            getStore({
                name: "userInfo"
            }) || {}
    },
    mutations: {
        /**
         * 设置用户信息
         */
        SET_USER_INFO(state: any, userInfo: UserInfo) {
            state.userInfo = userInfo
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
        }
    },
    actions: {}
}
export default user
