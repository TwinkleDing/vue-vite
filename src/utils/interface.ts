export interface userData {
    userId: string
    password: string
    account?: string
    type?: string
}

export type RouterItem = {
    path: string
    name: string
    component?: any
    redirect?: string
}
