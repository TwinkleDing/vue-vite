export function isHexColor(color: string) {
    const reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-f]{6})$/
    return reg.test(color)
}

export function rgbToHex(r: number, g: number, b: number) {
    // tslint:disable-next-line:no-bitwise
    const hex = ((r << 16) | (g << 8) | b).toString(16)
    return "#" + new Array(Math.abs(hex.length - 7)).join("0") + hex
}

export function hexToRGB(hex: string) {
    let sHex = hex.toLowerCase()
    if (isHexColor(hex)) {
        if (sHex.length === 4) {
            let sColorNew = "#"
            for (let i = 1; i < 4; i += 1) {
                sColorNew += sHex.slice(i, i + 1).concat(sHex.slice(i, i + 1))
            }
            sHex = sColorNew
        }
        const sColorChange: number[] = []
        for (let i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt("0x" + sHex.slice(i, i + 2)))
        }
        return "RGB(" + sColorChange.join(",") + ")"
    }
    return sHex
}

export function lighten(color: string, amount: number) {
    color = color.indexOf("#") >= 0 ? color.substring(1, color.length) : color
    amount = Math.trunc((255 * amount) / 100)
    return `#${addLight(color.substring(0, 2), amount)}${addLight(
        color.substring(2, 4),
        amount
    )}${addLight(color.substring(4, 6), amount)}`
}

function addLight(color: string, amount: number) {
    const cc = parseInt(color, 16) + amount
    const c = cc > 255 ? 255 : cc
    return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`
}

function getThemeCluster(theme: string) {
    const tintColor = (color: string, tint: number) => {
        let red = parseInt(color.slice(0, 2), 16)
        let green = parseInt(color.slice(2, 4), 16)
        let blue = parseInt(color.slice(4, 6), 16)
        if (tint === 0) {
            return "#" + theme
        }
        red += Math.round(tint * (255 - red))
        green += Math.round(tint * (255 - green))
        blue += Math.round(tint * (255 - blue))
        const colorRed = red.toString(16)
        const colorGreen = green.toString(16)
        const colorBlue = blue.toString(16)
        return `#${colorRed}${colorGreen}${colorBlue}`
    }
    const shadeColor = (color: string, shade: number) => {
        let red = parseInt(color.slice(0, 2), 16)
        let green = parseInt(color.slice(2, 4), 16)
        let blue = parseInt(color.slice(4, 6), 16)
        if (shade === 0) {
            return "#" + theme
        }
        red = Math.round((1 - shade) * red)
        green = Math.round((1 - shade) * green)
        blue = Math.round((1 - shade) * blue)
        const colorRed = red < 16 ? "0" + red.toString(16) : red.toString(16)
        const colorGreen = green < 16 ? "0" + green.toString(16) : green.toString(16)
        const colorBlue = blue < 16 ? "0" + blue.toString(16) : blue.toString(16)
        return `#${colorRed}${colorGreen}${colorBlue}`
    }
    const light: string[] = []
    const dark: string = shadeColor(theme, Number((0.2).toFixed(2)))
    for (let i = 0; i <= 9; i++) {
        light.push(tintColor(theme, Number((i / 10).toFixed(2))))
    }

    const clusters = {
        light,
        dark
    }
    return clusters
}

export const addElementPlusColor = (color: string) => {
    const themeCluster = getThemeCluster(color.replace("#", ""))
    const elementLight = themeCluster.light.map((c: string, i: number) => {
        return `--element-light-${i}: ${c}`
    })
    const elementDark = `--element-dark-2: ${themeCluster.dark}`

    return elementLight.join(";") + ";" + elementDark + ";"
}
