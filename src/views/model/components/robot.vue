<template>
    <div>
        <div id="model" class="model-ca" @keydown="keyDown"></div>
    </div>
</template>

<script >
import { onMounted, onUnmounted } from "vue"
import * as THREE from "three"
import Stats from "three/examples/jsm/libs/stats.module.js"
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
export default {
    props: {
        height: {
            type: Number,
            default: 765
        },
        width: {
            type: Number,
            default: 1360
        }
    },
    setup(props) {
        const stats = new Stats()
        const clock = new THREE.Clock()
        let scene
        let camera
        let renderer
        let model
        let mixer
        let previousAction
        let activeAction
        let actions
        let positionZ = 0
        let walkTime
        let controls
        let api = {
            state: "Idle"
        }
        let count = 0.001

        const init = () => {
            // 创建场景
            scene = new THREE.Scene()
            scene.background = new THREE.Color(0xe0e0e0)
            // scene.fog = new THREE.Fog(0xe0e0e0, 20, 100) // 雾化背景

            // 创建坐标系
            let axisHelper = new THREE.AxesHelper(5000)
            scene.add(axisHelper)

            // 创建相机
            let w = props.width
            let h = props.height
            // 透视相机
            camera = new THREE.PerspectiveCamera(60, w / h, 0.25, 10000)
            // 视角
            camera.lookAt(new THREE.Vector3(2, 0, 0))
            // 相机位置
            camera.position.set(-4, 7, -8)

            // 创建光源
            let ambient = new THREE.HemisphereLight(0xffffff, 0x444444)
            ambient.position.set(0, 20, 0)
            scene.add(ambient)
            let light = new THREE.DirectionalLight(0xffffff)
            light.position.set(0, 20, 10)
            scene.add(light)

            // ground
            let material = new THREE.MeshPhongMaterial({
                color: 0x999999,
                depthWrite: false
            })
            const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), material)
            mesh.rotation.x = -Math.PI / 2
            scene.add(mesh)

            const grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000)
            grid.material.opacity = 0.2
            grid.material.transparent = true
            scene.add(grid)

            let loader = new GLTFLoader()
            loader.load(
                "../../models/RobotExpressive.glb",
                (gltf) => {
                    model = gltf.scene
                    scene.add(model)
                    createGUI(model, gltf.animations)
                    animation()
                    render()
                },
                undefined,
                function (e) {
                    console.error(e)
                }
            )

            // 创建渲染器对象
            renderer = new THREE.WebGLRenderer({ antialias: true })
            renderer.setPixelRatio(window.devicePixelRatio)
            renderer.setSize(w, h)
            renderer.outputEncoding = THREE.sRGBEncoding
            renderer.setClearColor(0xb9d3ff, 1)
            const container = document.getElementById("model")
            container.appendChild(renderer.domElement)

            stats.dom.style.position = "absolute"
            container.appendChild(stats.dom)

            render()
            controlsEvent()
        }
        const createGUI = (model, animations) => {
            const gui = new GUI()
            gui.domElement.style.position = "absolute"
            let states = ["Idle", "Walking", "Running", "Dance", "Death", "Sitting", "Standing"]
            let emotes = ["Jump", "Yes", "No", "Wave", "Punch", "ThumbsUp"]
            mixer = new THREE.AnimationMixer(model)
            actions = {}
            for (let i = 0; i < animations.length; i++) {
                let clip = animations[i]
                let action = mixer.clipAction(clip)
                actions[clip.name] = action
                if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {
                    action.clampWhenFinished = true
                    action.loop = THREE.LoopOnce
                }
            }
            let statesFolder = gui.addFolder("States")
            let clipCtrl = statesFolder.add(api, "state").options(states)
            clipCtrl.onChange(() => {
                fadeToAction(api.state, 0.5)
                if (api.state === "Walking") {
                    camera.lookAt(scene.position)
                    walkTime = setInterval(() => {
                        if (positionZ >= 0.5) {
                            count = -0.001
                            model.rotation.y = Math.PI
                        } else if (positionZ < 0) {
                            model.rotation.y = 0
                            count = 0.001
                        }
                        positionZ += count
                        model.translateZ(positionZ)
                    }, 16)
                } else {
                    clearInterval(walkTime)
                }
            })
            statesFolder.open()

            let emoteFolder = gui.addFolder("Emotes")
            let createEmoteCallback = (name) => {
                api[name] = () => {
                    fadeToAction(name, 0.2)
                    mixer.addEventListener("finished", restoreState)
                }
                emoteFolder.add(api, name)
            }
            let restoreState = () => {
                mixer.removeEventListener("finished", restoreState)
                fadeToAction(api.state, 0.2)
            }
            for (let i = 0; i < emotes.length; i++) {
                createEmoteCallback(emotes[i])
            }
            emoteFolder.open()

            let face = model.getObjectByName("Head_2")
            let expressions = Object.keys(face.morphTargetDictionary)
            let expressionFolder = gui.addFolder("Expressions")
            for (let i = 0; i < expressions.length; i++) {
                expressionFolder.add(face.morphTargetInfluences, i, 0, 1, 0.01).name(expressions[i])
            }
            expressionFolder.open()
            activeAction = actions[api.state]
            activeAction.play()
        }
        const fadeToAction = (name, duration) => {
            previousAction = activeAction
            activeAction = actions[name]
            if (previousAction !== activeAction) {
                previousAction.fadeOut(duration)
            }
            activeAction
                .reset()
                .setEffectiveTimeScale(1)
                .setEffectiveWeight(1)
                .fadeIn(duration)
                .play()
        }
        const animation = () => {
            let dt = clock.getDelta()
            if (mixer) {
                mixer.update(dt)
            }
            controls.update()
            render()

            stats.update()
            requestAnimationFrame(animation)
        }
        // 控制器
        const controlsEvent = () => {
            controls = new OrbitControls(camera, renderer.domElement) //创建控件对象
            controls.enableDamping = true // 使动画循环使用时阻尼或自转 意思是否有惯性
            controls.dampingFactor = 0.3
            controls.enableZoom = true //是否可以缩放
            // controls.autoRotate = true //是否自动旋转
            // controls.enablePan = false //是否开启右键拖拽
            controls.minDistance = 2 //设置相机距离原点的最近距离
            controls.maxDistance = 60 //设置相机距离原点的最远距离
            controls.addEventListener("change", render) //监听鼠标、键盘事件

            // controls.addEventListener("start", render)
            // controls.addEventListener("end", render)

            keyDown()
        }
        const render = () => {
            renderer.render(scene, camera) //执行渲染操作
        }

        const keyDown = () => {
            window.onkeydown = (e) => {
                let { x, y, z } = camera.position
                if (e.keyCode === 87) {
                    y += 1
                }
                if (e.keyCode === 83) {
                    y -= 1
                }
                if (e.keyCode === 65) {
                }
                if (e.keyCode === 68) {
                }

                if (e.keyCode === 81) {
                    if (x === 2 || y === 2 || z === 2) {
                        return false
                    } else {
                        x = x >= 0 ? x + 1 : x - 1
                        y = y >= 0 ? y + 1 : y - 1
                        z = z >= 0 ? z + 1 : z - 1
                    }
                }
                if (e.keyCode === 69) {
                    if (x === 2 || y === 2 || z === 2) {
                        return false
                    } else {
                        x = x >= 0 ? x - 1 : x + 1
                        y = y >= 0 ? y - 1 : y + 1
                        z = z >= 0 ? z - 1 : z + 1
                    }
                }
                camera.position.set(x, y, z)
            }
        }

        onMounted(() => {
            init()
        })
        onUnmounted(() => {
            document.getElementsByClassName("lil-gui")[0].remove()
        })
    }
}
</script>

<style lang='scss' scoped>
.model-ca {
    position: relative;
}
.dg.ac {
    position: absolute;
    right: 0;
    top: 60px;
}
</style>