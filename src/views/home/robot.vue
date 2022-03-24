<template>
    <div>
        <div id="model" class="model-ca"></div>
    </div>
</template>

<script>
import * as THREE from "three"
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"

import Stats from "three/examples/jsm/libs/stats.module.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
let scene
let gui
let mesh
let camera
let grid
let renderer
let stats
let model
let controls
let mixer
let previousAction
let activeAction
let face
let actions
let clock
let api = {
    state: "Walking"
}
export default {
    name: "Robot",
    data() {
        return {}
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            // 创建场景
            scene = new THREE.Scene()
            scene.background = new THREE.Color(0xe0e0e0)
            // scene.fog = new THREE.Fog(0xe0e0e0, 20, 100); // 雾化背景

            // 创建坐标系
            let axisHelper = new THREE.AxesHelper(1000)
            scene.add(axisHelper)

            clock = new THREE.Clock()

            // 创建相机
            let w = 1200
            let h = 800
            // 透视相机
            camera = new THREE.PerspectiveCamera(60, w / h, 0.25, 1000)
            //
            camera.position.set(-4, 7, 8)
            camera.lookAt(new THREE.Vector3(0, 2, 0))

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
            mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), material)
            mesh.rotation.x = -Math.PI / 2
            scene.add(mesh)

            grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000)
            grid.material.opacity = 0.2
            grid.material.transparent = true
            scene.add(grid)

            let loader = new GLTFLoader()
            loader.load(
                "../../models/RobotExpressive.glb",
                (gltf) => {
                    model = gltf.scene
                    scene.add(model)
                    this.createGUI(model, gltf.animations)
                    this.animation()
                    this.render()
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
            document.getElementById("model").appendChild(renderer.domElement)
            // window.addEventListener('resize', this.onWindowResize, false);

            stats = new Stats()
            stats.dom.style.position = "absolute"
            document.getElementById("model").appendChild(stats.dom)

            this.render()
            this.controlsEvent()
        },
        animation() {
            let dt = clock.getDelta()
            if (mixer) {
                mixer.update(dt)
            }
            requestAnimationFrame(this.animation)
            this.render()
            stats.update()
        },
        onWindowResize() {
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(window.innerWidth, window.innerHeight)
            this.render()
        },
        render() {
            renderer.render(scene, camera) //执行渲染操作
        },
        // 控制器
        controlsEvent() {
            controls = new OrbitControls(camera, renderer.domElement) //创建控件对象
            controls.addEventListener("change", this.render) //监听鼠标、键盘事件
        },
        createGUI(model, animations) {
            gui = new GUI()
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
                this.fadeToAction(api.state, 0.5)
            })
            statesFolder.open()

            let emoteFolder = gui.addFolder("Emotes")
            let createEmoteCallback = (name) => {
                api[name] = () => {
                    this.fadeToAction(name, 0.2)
                    mixer.addEventListener("finished", restoreState)
                }
                emoteFolder.add(api, name)
            }
            let restoreState = () => {
                mixer.removeEventListener("finished", restoreState)
                this.fadeToAction(api.state, 0.2)
            }
            for (let i = 0; i < emotes.length; i++) {
                createEmoteCallback(emotes[i])
            }
            emoteFolder.open()

            face = model.getObjectByName("Head_2")
            let expressions = Object.keys(face.morphTargetDictionary)
            let expressionFolder = gui.addFolder("Expressions")
            for (let i = 0; i < expressions.length; i++) {
                expressionFolder.add(face.morphTargetInfluences, i, 0, 1, 0.01).name(expressions[i])
            }
            expressionFolder.open()
        
            activeAction = actions["Walking"]
            activeAction.play()
        },
        fadeToAction(name, duration) {
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