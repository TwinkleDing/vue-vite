import axios from "@/utils/axios"
import { BaseUrl } from "./baseApi"

export const loginApi = (data: any) => {
    return axios({
        url: `${BaseUrl}/auth/login`,
        method: "POST",
        data
    })
}

export const registerApi = (data: any) => {
    return axios({
        url: `${BaseUrl}/auth/register`,
        method: "POST",
        data
    })
}