import axios from "axios"
import NProgress from "nprogress"
import "nprogress/nprogress.css"
import { serialize } from "@/utils/utils"
import store from "@/store/index"
import { ElMessage } from "element-plus"
import router from "@/router"

// 设置超时时间
axios.defaults.timeout = 100000

// 返回其他状态吗
axios.defaults.validateStatus = (status: any) => {
    return status >= 200 && status <= 500 // 默认的
}
// 跨域请求，允许保存cookie
// axios.defaults.withCredentials = true; //没加cookie加上就cors跨域了，不加就好了？
// NProgress Configuration
NProgress.configure({
    showSpinner: false
})

// HTTPrequest拦截
axios.interceptors.request.use(
    (config: any) => {
        NProgress.start() // start progress bar
        const meta = config.meta || {}
        config.headers["Content-Type"] = "application/json;charset=utf-8"
        config.headers["Access-Control-Allow-Origin"] = true
        const token: string = store.getters.token || ""
        config.headers.token = token
        // headers中配置serialize为true开启序列化
        if (config.method === "post" && meta.isSerialize === true) {
            config.data = serialize(config.data)
        }
        if (config.method === "put" && meta.isSerialize === true) {
            config.data = serialize(config.data)
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// HTTPresponse拦截
axios.interceptors.response.use(
    (res: any) => {
        const status = parseInt(res.data.status) || 200
        // 如果是401则跳转到登录页面
        if (status === 401) {
            ElMessage({
                type: "error",
                message: res.data.message
            })
            store.dispatch("removeAll")
            router.push("/login")
            return
        }
        if (res.config.url.includes("/auth/login")) {
            if (res.data.data === "") {
                ElMessage({
                    type: "error",
                    message: "帐号或密码错误！"
                })
                return Promise.reject(new Error("帐号或密码错误！"))
            } else {
                store.commit("SET_TOKEN", res.data.data)
            }
        } else {
            store.commit("SET_TOKEN", res.headers.token)
        }
        NProgress.done()
        return Promise.resolve(res.data)
    },
    (error) => {
        NProgress.done()
        return Promise.reject(error)
    }
)

export default axios
