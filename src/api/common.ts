import axios from "@/utils/axios"
import { BaseUrl } from "./baseApi"

export const routerApi = () => {
    return axios({
        url: `${BaseUrl}/api/menuRouter`,
        method: "GET"
    })
}
