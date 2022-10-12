import axios from "@/utils/axios"
import { BaseUrl } from "./baseApi"

export const systemLogApi = (params: any) => {
    return axios({
        url: `${BaseUrl}/api/systemLog`,
        method: "GET",
        params
    })
}


export const deleteLogApi = (data: any) => {
    return axios({
        url: `${BaseUrl}/api/systemLog`,
        method: "DELETE",
        data
    })
}

export const deleteSelectLogApi = (data: any) => {
    return axios({
        url: `${BaseUrl}/api/systemLog/deleteSelect`,
        method: "DELETE",
        data
    })
}
