import axios from "@/utils/axios"

export const routerApi = () => {
    return axios({
        url: `/api/menuRouter`,
        method: "GET"
    })
}
