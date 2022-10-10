import axios from "@/utils/axios"
import { BaseUrl } from "./baseApi"

export const systemLogApi = (params: any) => {
    return axios({
        url: `${BaseUrl}/api/systemLog`,
        method: "GET",
        params
    })
}
