export default class SystemMouse {
    timer: any
    downTime: number
    down: boolean
    offsetX: number
    offsetY: number
    x: string
    y: string
    constructor() {
        this.timer = null
        this.downTime = 0
        this.down = false
        this.offsetX = 0
        this.offsetY = 0
        this.x = "200px"
        this.y = "60px"
    }
    mouseDown = (e: MouseEvent) => {
        this.downTime = new Date().getTime()
        this.down = true
        this.offsetX = e.offsetX
        this.offsetY = e.offsetY
    }
    mouseMove = (e: MouseEvent) => {
        return new Promise((resolve) => {
            clearTimeout(this.timer)
            if (!this.down) return
            this.x = e.clientX - this.offsetX + "px"
            this.y = e.clientY - this.offsetY + "px"
            resolve({ x: this.x, y: this.y })
        })
    }
    mouseOut = () => {
        this.timer = setTimeout(() => {
            this.down = false
        }, 500)
    }
    mouseUp = () => {
        return new Promise((resolve) => {
            clearTimeout(this.timer)
            if (new Date().getTime() - this.downTime < 300) {
                resolve({ drawer: true })
                return
            }
            this.down = false
            resolve({ x: this.x, y: this.y })
        })
    }
}
