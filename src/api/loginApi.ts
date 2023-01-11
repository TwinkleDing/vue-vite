import axios from "@/utils/axios"

export const loginApi = (data: any) => {
    return axios({
        url: `/auth/login`,
        method: "POST",
        data
    })
}

export const registerApi = (data: any) => {
    return axios({
        url: `/auth/register`,
        method: "POST",
        data
    })
}