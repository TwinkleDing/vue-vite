// 颜色计算方法
export const addLight = (color, amount) => {
    const cc = parseInt(color, 16) + amount
    const c = cc > 255 ? 255 : cc
    return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`
}

// 颜色计算方法
export const lighten = (color, amount) => {
    color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color
    amount = Math.trunc((255 * amount) / 192)
    return `#${addLight(color.substring(0, 2), amount)}${addLight(
        color.substring(2, 4),
        amount
    )}${addLight(color.substring(4, 6), amount)}`
}
