import { validateNull } from "./utils"

const SESSION = "session"
const LOCAL = "local"
interface storageParams {
    name: string
    content?: any
    type?: string
}
interface storage {
    dataType: string
    content: any
    dateTime: number
}

/**
 * 存储localStorage
 * @param params 存储的值
 */
export const setStore = (params: storageParams) => {
    let { name, content, type } = params
    let obj: storage = {
        dataType: typeof content,
        content: content,
        dateTime: new Date().getTime()
    }
    if (SESSION === type) {
        window.sessionStorage.setItem(name, JSON.stringify(obj))
    } else {
        window.localStorage.setItem(name, JSON.stringify(obj))
    }
}
/**
 * 获取localStorage
 * @param name storage的name
 * @returns storage的内容
 */

export const getStore = (params: storageParams) => {
    let { name, type } = params
    let obj: any = {}
    let content: any
    if (SESSION === type) {
        obj = window.sessionStorage.getItem(name)
    } else {
        obj = window.localStorage.getItem(name)
    }
    if (validateNull(obj)) {
        return
    }
    try {
        obj = JSON.parse(obj)
    } catch {
        return obj
    }
    if (obj.dataType === "string") {
        content = obj.content
    } else if (obj.dataType === "number") {
        content = Number(obj.content)
    } else if (obj.dataType === "boolean") {
        content = eval(obj.content)
    } else if (obj.dataType === "object") {
        content = obj.content
    }
    return content
}

/**
 *删除localStorage
 * @param params 要删除的storage的name
 */
export const removeStore = (params: storageParams) => {
    let { name, type } = params
    if (SESSION === type) {
        window.sessionStorage.removeItem(name)
    } else {
        window.localStorage.removeItem(name)
    }
}

/**
 * 获取全部localStorage
 */
/**
 *
 * @param params 类型
 * @returns 全部的storage
 */
export const getAllStore = (type?: string) => {
    let list = []
    if (SESSION === type) {
        for (let i = 0; i <= window.sessionStorage.length; i++) {
            list.push({
                name: window.sessionStorage.key(i),
                content: getStore({
                    name: window.sessionStorage.key(i),
                    type: SESSION
                })
            })
        }
    } else {
        for (let i = 0; i <= window.localStorage.length; i++) {
            list.push({
                name: window.localStorage.key(i),
                content: getStore({
                    name: window.localStorage.key(i)
                })
            })
        }
    }
    return list
}

/**
 * 清空全部localStorage
 */
/**
 *
 * @param params 类型
 */
export const clearStore = (type: string) => {
    if (SESSION === type) {
        window.sessionStorage.clear()
    } else {
        window.localStorage.clear()
    }
}
