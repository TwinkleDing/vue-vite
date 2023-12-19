export default class Puzzle {
    public static DEFAULT_COUNT = 0
    public static playing: boolean = false
    public static over: boolean = false
    public static img: ImageBitmap
    private count: number = Puzzle.DEFAULT_COUNT
    private time: number = Puzzle.DEFAULT_COUNT
    private timer: any
    private tier: number = 3
    private width: number = 600
    private blockSize: number
    private blockList: Array<Block> = []
    private data: any = {}
    private originalData: any = {}
    private initData: boolean = true
    constructor(img: ImageBitmap, tier: number, width: number) {
        Puzzle.img = img
        this.tier = tier || this.tier
        this.width = width || this.width
        this.blockSize = this.width / this.tier
        this.init()
    }
    /**
     * 初始化拼图
     */
    private init(): void {
        const itemLength: number = Math.pow(this.tier, 2)
        for (let i = 0; i < this.tier; i++) {
            for (let j = 0; j < this.tier; j++) {
                const coordinate: Array<number> = [i * this.blockSize, j * this.blockSize]
                const block: Block = new Block(i * this.tier + j + 1 !== itemLength, coordinate)
                this.blockList.push(block)
            }
        }
        this.setOriginalData()
        this.setData()
    }
    /**
     * 开始游戏
     */
    public start(): void {
        this.randomBlock()
        const startTime = new Date().getTime()
        this.count = Puzzle.DEFAULT_COUNT
        this.timer = setInterval(() => {
            this.time = new Date().getTime() - startTime
            this.setData()
        }, 10)
        Puzzle.playing = true
        Puzzle.over = false
        this.setData()
    }
    /**
     * 随机打乱方块
     */
    private randomBlock(): void {
        this.blockList.forEach((item: Block, i: number) => {
            if (item.getIsImg()) {
                const index = getRandom(0, this.blockList.length - 2, i)
                const temp = [...item.getRandom()]
                item.setRandom([...this.blockList[index].getRandom()])
                this.blockList[index].setRandom([...temp])
            }
        })
        function getRandom(min: number, max: number, i: number): number {
            const r: number = Math.floor(Math.random() * (max + 1 - min) + min)
            if (r !== i) {
                return r
            } else {
                return getRandom(min, max, i)
            }
        }
    }
    /**
     * 重置拼图
     */
    public reset(): void {
        clearInterval(this.timer)
        this.count = Puzzle.DEFAULT_COUNT
        this.time = Puzzle.DEFAULT_COUNT
        Puzzle.playing = false
        this.blockList.forEach((item: Block, index: number) => {
            item.setRandom(item.getCoordinate())
        })
        this.setData()
    }
    /**
     * 每一个块的点击事件，判断是改和哪个交换位置
     * @param item 每一个块
     */
    public blockClick(item: Block): void {
        if (Puzzle.playing && !Puzzle.over) {
            const coordinate: Array<number> = item.getRandom()
            // left
            if (coordinate[0] - this.blockSize >= 0) {
                this.emptyChange(coordinate[0] - this.blockSize, coordinate[1], item)
            }
            // top
            if (coordinate[1] - this.blockSize >= 0) {
                this.emptyChange(coordinate[0], coordinate[1] - this.blockSize, item)
            }
            //right
            if (coordinate[0] + this.blockSize < this.width) {
                this.emptyChange(coordinate[0] + this.blockSize, coordinate[1], item)
            }
            // bottom
            if (coordinate[1] + this.blockSize < this.width) {
                this.emptyChange(coordinate[0], coordinate[1] + this.blockSize, item)
            }
        }
        this.setData()
    }
    /**
     * 每次点击之后改变的内容
     * @param x 第几行
     * @param y 第几列
     * @param item 块的内容
     */
    private emptyChange(x: number, y: number, item: Block): void {
        const empty: Block = this.blockList[this.blockList.length - 1]
        const coordinate: Array<number> = empty.getRandom()
        if (x === coordinate[0] && y === coordinate[1]) {
            const substitution: Array<number> = item.getRandom()
            item.setRandom([coordinate[0], coordinate[1]])
            empty.setRandom(substitution)
            this.count++
            this.hasOver()
        }
    }
    /**
     * 是否结束游戏
     */
    private hasOver(): void {
        let everyOver: boolean = true
        this.blockList.forEach((item: Block) => {
            const coordinate = item.getCoordinate()
            const random = item.getRandom()
            if (coordinate[0] !== random[0] || coordinate[1] !== random[1]) {
                everyOver = false
            }
        })
        if (everyOver) {
            clearInterval(this.timer)
            Puzzle.over = true
        }
    }
    /**
     * 监听函数
     * @param cb
     */
    public puzzleChange(cb: any) {
        const _self = this
        this.data = new Proxy(this.originalData, {
            /**
             * @param {Object, Array} target 设置值的对象
             * @param {string} key 属性
             * @param {any} value 值
             * @param {Object} receiver this
             */
            set: function (target, key, value, receiver) {
                target[key] = value
                cb(_self)
                return true
            }
        })
    }
    /**
     * 每当有属性发生改变触发，为了触发监听函数
     */
    private setData(): void {
        if (this.initData) {
            for (let key in this.originalData) {
                this.data[key] = this.originalData[key]
            }
            this.initData = false
        } else {
            for (let key in this.data) {
                if (
                    typeof this.data[key] === "object" &&
                    this.data[key] !== null &&
                    this.data[key] !== undefined &&
                    this.data[key]?.toString() !== (this as any)[key].toString()
                ) {
                    this.data[key] = (this as any)[key]
                } else if (this.data[key] !== (this as any)[key]) {
                    this.data[key] = (this as any)[key]
                }
            }
        }
    }
    private setOriginalData(): void {
        let obj: any = {}
        for (let key in this) {
            if (typeof this[key] !== "function") {
                obj[key] = this[key]
            }
        }
        this.originalData = obj
    }

    getOver(): boolean {
        return Puzzle.over
    }
    getImg(): ImageBitmap {
        return Puzzle.img
    }
    getItemSize(): number {
        return this.blockSize
    }
    getCount(): number {
        return this.count
    }
    getTime(): number {
        return this.time
    }
    getImageList(): Array<Block> {
        return this.blockList
    }
}

export class Block {
    private isImg: boolean
    private coordinate: Array<number> | [0, 0]
    private random: Array<number> | [0, 0]
    constructor(isImg: boolean, coordinate: any) {
        this.isImg = isImg
        this.coordinate = coordinate
        this.random = coordinate
    }
    setIsImg(value: boolean): void {
        this.isImg = value
    }
    getIsImg(): boolean {
        return this.isImg
    }
    setCoordinate(coordinate: Array<number>): void {
        this.coordinate = coordinate
    }
    getCoordinate(): Array<number> {
        return this.coordinate
    }
    setRandom(random: Array<number>) {
        this.random = random
    }
    getRandom(): Array<number> {
        return this.random
    }
}
