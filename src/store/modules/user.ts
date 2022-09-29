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
        SET_USER_INFO(state: any, userInfo: UserInfo) {
            state.userInfo = userInfo
            setStore({
                name: "userInfo",
                content: userInfo
            })
        },
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
