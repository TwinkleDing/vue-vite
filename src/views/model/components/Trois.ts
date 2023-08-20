import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

export default class Trois {
    private static readonly IDLE_TO_WALK: string = "IDLE_TO_WALK"
    private static readonly WALK_TO_RUN: string = "WALK_TO_RUN"
    private static readonly RUN_TOP_WALK: string = "RUN_TOP_WALK"
    private static readonly WALK_TO_IDLE: string = "WALK_TO_IDLE"
    private static readonly ONE_STEP: number = 0.05
    private current: number = 0
    private runWeight: number = 0
    private idleWeight: number = 0
    private walkWeight: number = 0
    private fadeDuration: number = 3
    private sizeOfNextStep: number = 0
    private singleStepMode: boolean = false
    private mixer!: THREE.AnimationMixer
    private idleAction!: THREE.AnimationAction
    private walkAction!: THREE.AnimationAction
    private runAction!: THREE.AnimationAction
    private actions: THREE.AnimationAction[] = []
    private clock: THREE.Clock = new THREE.Clock()
    private data: any = {}
    private originalData: any = {}
    private initData: boolean = true

    constructor() {
        this.setOriginalData()
    }
    initModel(): Promise<void> {
        const loader = new GLTFLoader()
        return new Promise<any>((resolve, reject) => {
            loader.load("../../models/Soldier.glb", (gltf) => {
                const model = gltf.scene
                // 显示每个部件的影子
                model.traverse(function (object: THREE.Object3D<THREE.Event>) {
                    object.castShadow = true
                })
                this.mixer = new THREE.AnimationMixer(model)
                gltf.animations.map((item: THREE.AnimationClip) => {
                    this.actions.push(this.mixer?.clipAction(item))
                })
                this.idleAction = this.actions[0]
                this.walkAction = this.actions[3]
                this.runAction = this.actions[1]
                this.activateAllActions()
                this.activeAction(0)
                this.animate()
                resolve(model)
            })
        })
    }

    // 开启一个动作
    activeAction(index: number): void {
        this.current = index
        this.actions.forEach((item: THREE.AnimationAction, i: number) => {
            if (index === i) {
                this.setWeight(this.actions[index], 1)
                this.actions[index].play()
            } else {
                this.setWeight(item, 0)
            }
        })
    }

    // 设置比重
    setWeight(action: THREE.AnimationAction, weight: number) {
        action.enabled = true
        action.setEffectiveTimeScale(1)
        action.setEffectiveWeight(weight)
    }

    // 设置动作时段
    timeScaleChange(timeScale: number): void {
        this.mixer.timeScale = timeScale
    }

    // 暂停/继续
    pause(): void {
        // 如果是帧动状态，先解除帧动状态
        if (this.singleStepMode) {
            this.singleStepMode = false
        } else {
            this.actions[this.current].paused = !this.actions[this.current].paused
        }
    }

    // 帧动
    frame(): void {
        // 如果是动画状态的暂停，先解除
        this.actions[this.current].paused = false
        // 开启单步状态，并设置每次单步的间隔
        this.singleStepMode = true
        this.sizeOfNextStep = Trois.ONE_STEP
    }

    // 设置淡入
    setFade(type: string): void {
        // 从停到走
        if (type === Trois.IDLE_TO_WALK) {
            this.prepareCrossFade(this.idleAction, this.walkAction)
            this.current = 3
        }
        // 从走到跑
        if (type === Trois.WALK_TO_RUN) {
            this.prepareCrossFade(this.walkAction, this.runAction)
            this.current = 1
        }
        // 从跑到走
        if (type === Trois.RUN_TOP_WALK) {
            this.prepareCrossFade(this.runAction, this.walkAction)
            this.current = 3
        }
        // 从走到停
        if (type === Trois.WALK_TO_IDLE) {
            this.prepareCrossFade(this.walkAction, this.idleAction)
            this.current = 0
        }
    }

    // 交叉淡入
    prepareCrossFade(startAction: THREE.AnimationAction, endAction: THREE.AnimationAction): void {
        // 关闭单步状态
        this.singleStepMode = false
        // 关闭暂停
        this.actions[this.current].paused = false
        this.unPauseAllActions()
        if (startAction === this.idleAction) {
            this.executeCrossFade(startAction, endAction, this.fadeDuration)
        } else {
            this.synchronizeCrossFade(startAction, endAction, this.fadeDuration)
        }
    }

    // 同步淡入
    synchronizeCrossFade(
        startAction: THREE.AnimationAction,
        endAction: THREE.AnimationAction,
        duration: number
    ): void {
        const onLoopFinished = (event: any) => {
            if (event.action === startAction) {
                this.mixer.removeEventListener("loop", onLoopFinished)
                this.executeCrossFade(startAction, endAction, duration)
            }
        }
        this.mixer.addEventListener("loop", onLoopFinished)
    }

    // 开始淡入
    executeCrossFade(
        startAction: THREE.AnimationAction,
        endAction: THREE.AnimationAction,
        duration: number
    ): void {
        this.setWeight(endAction, 1)
        endAction.time = 0
        startAction.crossFadeTo(endAction, duration, true)
    }

    // 启动所有动作
    activateAllActions(): void {
        this.actions.forEach(function (action: THREE.AnimationAction) {
            action.play()
        })
    }

    // 恢复所有动作
    unPauseAllActions(): void {
        this.actions.forEach(function (action: THREE.AnimationAction) {
            action.paused = false
        })
    }

    // 禁用所有动作
    deactivateAllActions(): void {
        this.actions.forEach(function (action: THREE.AnimationAction) {
            action.stop()
        })
    }

    animate(): void {
        requestAnimationFrame(this.animate.bind(this))
        this.idleWeight = this.idleAction.getEffectiveWeight()
        this.walkWeight = this.walkAction.getEffectiveWeight()
        this.runWeight = this.runAction.getEffectiveWeight()

        let mixerUpdateDelta: number = this.clock.getDelta()
        // 如果是帧动模式，开启单步状态
        if (this.singleStepMode) {
            mixerUpdateDelta = this.sizeOfNextStep
            this.sizeOfNextStep = 0
        }
        this.mixer.update(mixerUpdateDelta)
        this.setData()
    }

    troisChange(cb: any) {
        const _self = this
        this.data = new Proxy(this.originalData, {
            /**
             * @param {Object, Array} target 设置值的对象
             * @param {String} key 属性
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
                    this.data[key]?.toString() !== this[key].toString()
                ) {
                    this.data[key] = this[key]
                } else if (this.data[key] !== this[key]) {
                    this.data[key] = this[key]
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

    setCurrent(current: number): void {
        this.current = current
    }
    getCurrent(): number {
        return this.current
    }
    getActionList(): THREE.AnimationAction[] {
        return this.actions
    }
    setFadeDuration(duration: number): void {
        this.fadeDuration = duration
    }
    getIdleWeight(): number {
        return this.idleWeight
    }
    getWalkWeight(): number {
        return this.walkWeight
    }
    getRunWeight(): number {
        return this.runWeight
    }
}
