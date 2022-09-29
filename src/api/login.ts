import axios from "@/utils/axios"
import { BaseUrl } from "./baseApi"

export const login = (data: any) => {
    return axios({
        url: `${BaseUrl}/api/updateApplication`,
        method: "POST",
        data
    })
}
