<template>
    <div>
        <div id="model" class="model-ca"></div>
    </div>
</template>
<script>
    import { defineComponent, onMounted, onUnmounted } from "vue"
    import * as THREE from "three"
    import Stats from "three/examples/jsm/libs/stats.module.js"
    import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
    export default defineComponent({
        name: "Bee",
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
            let controls
            let api = { state: "_bee_idle" }
            let gui

            const init = () => {
                scene = new THREE.Scene()
                scene.background = new THREE.Color(0xe0e0e0)
                let axesHelper = new THREE.AxesHelper(5000)
                scene.add(axesHelper)

                let w = props.width
                let h = props.height

                camera = new THREE.PerspectiveCamera(60, w / h, 0.25, 10000)
                camera.lookAt(new THREE.Vector3(2, 0, 0))
                camera.position.set(100, 100, 100)
                let ambient = new THREE.HemisphereLight(0xffffff, 0x444444)
                ambient.position.set(0, 20, 0)
                scene.add(ambient)
                let light = new THREE.DirectionalLight(0xffffff)
                light.position.set(0, 20, 10)
                scene.add(light)
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
                    "../../models/Bee.glb",
                    (gltf) => {
                        model = gltf.scene
                        createGUI(model, gltf.animations)
                        scene.add(model)
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
            const createGUI = (model, animations) => {
                gui = new GUI()
                gui.domElement.style.position = "absolute"
                mixer = new THREE.AnimationMixer(model)
                actions = {}
                animations.forEach((a, i) => {
                    let action = mixer.clipAction(a)
                    actions[a.name] = action
                })

                let emoteFolder = gui.addFolder("动作")
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

                animations.forEach((a, i) => {
                    createEmoteCallback(a.name)
                })
                emoteFolder.open()

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
            // 控制器
            const controlsEvent = () => {
                controls = new OrbitControls(camera, renderer.domElement) //创建控件对象
                controls.enableDamping = true // 使动画循环使用时阻尼或自转 意思是否有惯性
                controls.dampingFactor = 0.3
                controls.enableZoom = true //是否可以缩放
                // controls.autoRotate = true //是否自动旋转
                // controls.enablePan = false //是否开启右键拖拽
                controls.minDistance = 2 //设置相机距离原点的最近距离
                controls.maxDistance = 200 //设置相机距离原点的最远距离
                controls.addEventListener("change", render) //监听鼠标、键盘事件

                controls.addEventListener("start", render)
                controls.addEventListener("end", render)
            }
            const render = () => {
                renderer.render(scene, camera) //执行渲染操作
            }
            onMounted(() => {
                init()
            })
            onUnmounted(() => {
                gui.domElement.remove()
            })
            return {}
        }
    })
</script>

<style scoped>
    .model-ca {
        position: relative;
    }
    .dg.ac {
        position: absolute;
        right: 0;
        top: 60px;
    }
</style>
