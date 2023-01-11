import axios from "@/utils/axios"

export const tableListApi = (params: any) => {
    return axios({
        url: `/api/tableTest`,
        method: "GET",
        params
    })
}

export const tableAddApi = (data: any) => {
    return axios({
        url: `/api/tableTest`,
        method: "POST",
        data
    })
}

export const tableVolumeApi = (data: any) => {
    return axios({
        url: `/api/tableVolume`,
        method: "POST",
        data
    })
}

export const tableDeleteApi = (data: any) => {
    return axios({
        url: `/api/tableDelete`,
        method: "DELETE",
        data
    })
}