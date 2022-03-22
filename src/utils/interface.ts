export interface UserInfo {
    userId: string
    password: string
    account?: string
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
