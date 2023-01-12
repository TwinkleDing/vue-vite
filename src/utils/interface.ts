export interface UserInfo {
    userName: string
    type?: string
}

interface Meta {
    icon: string
    label: string
    permission: boolean
}
/**
 * 路由格式
 */
export interface RouterItem {
    path: string
    name: string
    redirect?: string
    component?: any
    children?: any
    meta?: Meta
}

export interface Res {
    status: number
    message?: string
    data: any
}

/**
 * 分页器格式
 */
export interface Page {
    number: number
    size: number
    total: number
    sizes: number[]
}

interface GameList {
    name: string
    price: number
    platform: string
    time: string
    img: any
}
