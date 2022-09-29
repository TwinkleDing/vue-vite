import axios from "@/utils/axios"
import { BaseUrl } from "./baseApi"

export const loginApi = (data: any) => {
    return axios({
        url: `${BaseUrl}/api/login`,
        method: "POST",
        data
    })
}

export const registerApi = (data: any) => {
    return axios({
        url: `${BaseUrl}/api/register`,
        method: "POST",
        data
    })
}