import axios from "@/utils/axios"

export const systemLogApi = (params: any) => {
    return axios({
        url: "/api/systemLog",
        method: "GET",
        params
    })
}

export const deleteLogApi = (data: any) => {
    return axios({
        url: "/api/systemLog",
        method: "DELETE",
        data
    })
}

export const deleteSelectLogApi = (data: any) => {
    return axios({
        url: "/api/systemLog/deleteSelect",
        method: "DELETE",
        data
    })
}
export const deleteAllApi = () => {
    return axios({
        url: "/api/systemLog/deleteAll",
        method: "DELETE"
    })
}
