import axios from "@/utils/axios"
import { BaseUrl } from "./baseApi"

export const tableListApi = (params: any) => {
    return axios({
        url: `${BaseUrl}/api/tableTest`,
        method: "GET",
        params
    })
}

export const tableAddApi = (data: any) => {
    return axios({
        url: `${BaseUrl}/api/tableTest`,
        method: "POST",
        data
    })
}
