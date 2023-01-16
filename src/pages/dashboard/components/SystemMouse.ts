import { SYSTEM_ICON_DEFAULT_X, SYSTEM_ICON_DEFAULT_Y } from "@/settings/config"
interface SystemResolve {
    drawer?: boolean
    x?: number
    y?: number
}
export default class SystemMouse {
    downTime: number
    offsetX: number
    offsetY: number
    x: number
    y: number
    down: boolean
    timer: any
    constructor() {
        this.downTime = 0
        this.offsetX = 0
        this.offsetY = 0
        this.x = SYSTEM_ICON_DEFAULT_X
        this.y = SYSTEM_ICON_DEFAULT_Y
        this.down = false
        this.timer = null
    }
    mouseDown = (e: MouseEvent): void => {
        this.downTime = new Date().getTime()
        this.down = true
        this.offsetX = e.offsetX
        this.offsetY = e.offsetY
    }
    mouseMove = (e: MouseEvent): Promise<SystemResolve> => {
        return new Promise((resolve) => {
            clearTimeout(this.timer)
            if (!this.down) return
            this.x = e.clientX - this.offsetX
            this.y = e.clientY - this.offsetY
            resolve({ x: this.x, y: this.y })
        })
    }
    mouseOut = (): void => {
        this.timer = setTimeout(() => {
            this.down = false
        }, 500)
    }
    mouseUp = (): Promise<SystemResolve> => {
        return new Promise((resolve) => {
            clearTimeout(this.timer)
            if (new Date().getTime() - this.downTime < 300) {
                resolve({ drawer: true })
            } else {
                this.down = false
                resolve({ x: this.x, y: this.y })
            }
        })
    }
}
