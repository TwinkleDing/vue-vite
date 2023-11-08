class Puzzle {
    public static DEFAULT_COUNT = 0
    public static playing: boolean = false
    public static over: boolean = false
    public static img: ImageBitmap
    private count: number = Puzzle.DEFAULT_COUNT
    private time: number = Puzzle.DEFAULT_COUNT
    private timer: any
    private block: number
    private width: number
    private itemSize: number
    private imgList: Array<Image> = []
    private data: any = {}
    private originalData: any = {}
    private initData: boolean = true
    constructor(img: ImageBitmap, block: number, width: number) {
        Puzzle.img = img
        this.block = block
        this.width = width
        this.itemSize = this.width / this.block
        this.init()
    }
    init(): void {
        const itemLength: number = Math.pow(this.block, 2)
        for (let i = 0; i < this.block; i++) {
            for (let j = 0; j < this.block; j++) {
                const coordinate: Array<number> = [i * this.itemSize, j * this.itemSize]
                const img: Image = new Image(i * this.block + j + 1 !== itemLength, coordinate)
                this.imgList.push(img)
            }
        }
        this.setOriginalData()
        this.setData()
    }
    start(): void {
        this.randomImg()
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
    randomImg(): void {
        this.imgList.forEach((item: Image, i: number) => {
            if (item.getIsImg()) {
                const index = getRandom(0, this.imgList.length - 2, i)
                const temp = [...item.getRandom()]
                item.setRandom([...this.imgList[index].getRandom()])
                this.imgList[index].setRandom([...temp])
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
    reset(): void {
        clearInterval(this.timer)
        this.count = Puzzle.DEFAULT_COUNT
        this.time = Puzzle.DEFAULT_COUNT
        Puzzle.playing = false
        this.imgList.forEach((item: Image, index: number) => {
            item.setRandom(item.getCoordinate())
        })
        this.setData()
    }
    itemClick(item: Image): void {
        if (Puzzle.playing && !Puzzle.over) {
            const coordinate: Array<number> = item.getRandom()
            // left
            if (coordinate[0] - this.itemSize >= 0) {
                this.emptyChange(coordinate[0] - this.itemSize, coordinate[1], item)
            }
            // top
            if (coordinate[1] - this.itemSize >= 0) {
                this.emptyChange(coordinate[0], coordinate[1] - this.itemSize, item)
            }
            //right
            if (coordinate[0] + this.itemSize < this.width) {
                this.emptyChange(coordinate[0] + this.itemSize, coordinate[1], item)
            }
            // bottom
            if (coordinate[1] + this.itemSize < this.width) {
                this.emptyChange(coordinate[0], coordinate[1] + this.itemSize, item)
            }
        }
        this.setData()
    }
    emptyChange(x: number, y: number, item: Image): void {
        const empty: Image = this.imgList[this.imgList.length - 1]
        const coordinate: Array<number> = empty.getRandom()
        if (x === coordinate[0] && y === coordinate[1]) {
            const substitution: Array<number> = item.getRandom()
            item.setRandom([coordinate[0], coordinate[1]])
            empty.setRandom(substitution)
            this.count++
            this.hasOver()
        }
    }
    hasOver(): void {
        let everyOver: boolean = true
        this.imgList.forEach((item: Image) => {
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
    puzzleChange(cb: any) {
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
    setData(): void {
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
    setOriginalData(): void {
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
        return this.itemSize
    }
    getCount(): number {
        return this.count
    }
    getTime(): number {
        return this.time
    }
    getImageList(): Array<Image> {
        return this.imgList
    }
}

export class Image {
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

export default Puzzle
