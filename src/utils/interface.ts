export interface UserInfo {
    userName: string
    type?: string
}

export type RouterItem = {
    path: string
    name: string
    redirect?: string
    component?: any
    children?: any
    meta?: any
}
