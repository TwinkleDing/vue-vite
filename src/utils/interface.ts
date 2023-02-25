/**
 * 用户建议信息格式
 */
export interface UserInfo {
    userName: string
    type?: string
}

/**
 * 路由的Meta信息格式
 */
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

/**
 * Res返回值格式
 */
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

/**
 * 游戏列表格式
 */
export interface GameList {
    name: string
    price: number
    platform: string
    time: string
    img: any
}

/**
 * 系统设置按钮格式
 */
export interface SystemIcon {
    x: number
    y: number
}


/**
 * 标签页格式
 */
export interface RouterHistory {
    label: string
    path: string
}
