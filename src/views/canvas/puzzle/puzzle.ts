class Puzzle {
    private static DEFAULT_COUNT = 0
    private static playing: boolean = false
    private static over: boolean = false
    private static img: ImageBitmap
    private static count: number
    private type: number
    private width: number
    private itemSize: number
    private imgList: Array<Image> = []
    constructor(img: ImageBitmap, type: number, width: number) {
        Puzzle.img = img
        this.type = type
        this.width = width
        Puzzle.count = Puzzle.DEFAULT_COUNT
        this.itemSize = this.width / this.type
        this.init()
    }
    init(): void {
        Puzzle.count = Puzzle.DEFAULT_COUNT
        const itemLength: number = Math.pow(this.type, 2)
        for (let i = 0; i < this.type; i++) {
            for (let j = 0; j < this.type; j++) {
                const coordinate: Array<number> = [i * this.itemSize, j * this.itemSize]
                const img: Image = new Image(i * this.type + j + 1 !== itemLength, coordinate)
                this.imgList.push(img)
            }
        }
    }
    start(): void {
        Puzzle.count = Puzzle.DEFAULT_COUNT
        Puzzle.playing = true
        Puzzle.over = false
        let randomList: Array<number> = []
        while (true) {
            let random: number = Math.floor(Math.random() * (this.imgList.length - 1))
            if (!randomList.includes(random)) {
                randomList.push(random)
            }
            if (randomList.length === this.imgList.length - 1) {
                break
            }
        }
        this.imgList.forEach((item: Image, index: number) => {
            if (item.getIsImg()) {
                item.setRandom(this.imgList[randomList[index]].getCoordinate())
            }
        })
    }
    reset(): void {
        Puzzle.count = Puzzle.DEFAULT_COUNT
        Puzzle.playing = false
        this.imgList.forEach((item: Image, index: number) => {
            if (item.getIsImg()) {
                item.setRandom([])
            } else {
                item.setRandom(item.getCoordinate())
            }
        })
    }
    itemClick(item: Image): void {
        if (Puzzle.playing && !Puzzle.over) {
            let coordinate: Array<number> = item.getRandom()
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
    }

    emptyChange(x: number, y: number, item: Image): void {
        const empty: Image = this.imgList[this.imgList.length - 1]
        const coordinate: Array<number> = empty.getRandom()
        if (x === coordinate[0] && y === coordinate[1]) {
            const substitution: Array<number> = item.getRandom()
            item.setRandom([coordinate[0], coordinate[1]])
            empty.setRandom(substitution)
            Puzzle.count++
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
            Puzzle.over = true
        }
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
        return Puzzle.count
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
