/**
 * 对象深拷贝
 * @param data 对象
 * @returns 深拷贝之后的对象
 */
export const deepClone = (data: any) => {
    const type: string = getObjType(data)
    let obj: any
    if (type === "array") {
        obj = []
    } else if (type === "object") {
        obj = {}
    } else {
        //不再具有下一层次
        return data
    }
    if (type === "array") {
        for (let i = 0, len = data.length; i < len; i++) {
            obj.push(deepClone(data[i]))
        }
    } else if (type === "object") {
        for (let key in data) {
            obj[key] = deepClone(data[key])
        }
    }
    return obj
}

/**
 * 判断值是不是null
 * @param val 值
 * @returns 是不是null
 */
export const validateNull = (val: any) => {
    if (typeof val === "boolean") {
        return false
    }
    if (typeof val === "number") {
        return false
    }
    if (val instanceof Array) {
        if (val.length === 0) {
            return true
        }
    } else if (val instanceof Object) {
        if (JSON.stringify(val) === "{}") {
            return true
        }
    } else {
        if (
            val === "null" ||
            val === null ||
            val === "undefined" ||
            val === undefined ||
            val === ""
        ) {
            return true
        }
        return false
    }
    return false
}

/**
 * 获取对象类型
 * @param obj
 * @returns 对象类型
 */
export const getObjType = (obj: any) => {
    const toString: any = Object.prototype.toString
    const map: any = {
        "[object Boolean]": "boolean",
        "[object Number]": "number",
        "[object String]": "string",
        "[object Function]": "function",
        "[object Array]": "array",
        "[object Date]": "date",
        "[object RegExp]": "regExp",
        "[object Undefined]": "undefined",
        "[object Null]": "null",
        "[object Object]": "object"
    }
    if (obj instanceof Element) {
        return "element"
    }
    return map[toString.call(obj)]
}

/**
 * 打开小窗口
 */
export const openWindow = (url: string, title: string, w: number, h: number) => {
    // Fixes dual-screen position                            Most browsers       Firefox
    const width = window.innerWidth
        ? window.innerWidth
        : document.documentElement.clientWidth
        ? document.documentElement.clientWidth
        : screen.width
    const height: number = window.innerHeight
        ? window.innerHeight
        : document.documentElement.clientHeight
        ? document.documentElement.clientHeight
        : screen.height
    const left: number = width / 2 - w / 2
    const top: number = height / 2 - h / 2
    const newWindow: any = window.open(
        url,
        title,
        "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=" +
            w +
            ", height=" +
            h +
            ", top=" +
            top +
            ", left=" +
            left
    )

    // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus()
    }
}
