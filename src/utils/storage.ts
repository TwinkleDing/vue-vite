import { validateNull } from "./utils"
import { LOCAL_STORAGE } from "@/settings/config"

interface StorageParams {
    name: string | null
    content?: any
    type?: string
}
interface StorageData {
    dataType: string
    content: any
    dateTime: number
}

/**
 * 存储localStorage
 *
 * @param params 存储的值
 */
export const setStore = (params: StorageParams): void => {
    let { name, content, type = LOCAL_STORAGE } = params
    if (!name) {
        return
    }
    let obj: StorageData = {
        dataType: typeof content,
        content: content,
        dateTime: new Date().getTime()
    }
        ; (window as any)[type].setItem(name, JSON.stringify(obj))
}

/**
 * 获取localStorage
 *
 * @param params storage的name
 * @returns storage的内容
 */
export const getStore = (params: StorageParams): any => {
    let { name, type = LOCAL_STORAGE } = params
    if (!name) {
        return
    }
    const data: string = (window as any)[type].getItem(name)
    let obj: StorageData

    if (validateNull(data)) {
        return
    }
    try {
        obj = JSON.parse(data)
        let content: any
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
    } catch {
        return data
    }
}

/**
 *删除localStorage

 * @param params 要删除的storage的name
 */
export const removeStore = (params: StorageParams): void => {
    let { name, type = LOCAL_STORAGE } = params
    if (!name) {
        return
    }
    ; (window as any)[type].removeItem(name)
}

/**
 * 获取全部storage
 *
 * @param params 类型
 * @returns 全部的storage
 */
export const getAllStore = (type: string = LOCAL_STORAGE): StorageParams[] => {
    let list: StorageParams[] = []
    const storage = (window as any)[type]
    for (let i = 0; i <= storage.length; i++) {
        list.push({
            name: storage.key(i),
            content: getStore({
                name: storage.key(i),
                type
            }),
            type
        })
    }
    return list
}

/**
 * 清空全部storage
 *
 * @param params 类型
 */
export const clearStore = (type: string = LOCAL_STORAGE): void => {
    ; (window as any)[type].clear()
}
