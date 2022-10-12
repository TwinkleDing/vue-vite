export interface UserInfo {
    userName: string
    type?: string
}

/**
 * 路由格式
 */
export type RouterItem = {
    path: string
    name: string
    redirect?: string
    component?: any
    children?: any
    meta?: any
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
