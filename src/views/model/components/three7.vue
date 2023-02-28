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
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

export default defineComponent({
    name: "Models",
    props: {
        height: {
            type: Number,
            default: 0
        },
        width: {
            type: Number,
            default: 0
        }
    },
    setup(props) {
        let scene
        let camera
        let renderer
        let spriteGroup
        const stats = new Stats()
        const clock = new THREE.Clock()
        let tree
        let light
        let rotateCamera
        let spriteAn
        let ground
        const init = () => {
            // 创建场景
            scene = new THREE.Scene()

            // 创建相机
            const w = props.width
            const h = props.height

            // 透视相机
            camera = new THREE.PerspectiveCamera(45, w / h, 0.01, 100000)
            camera.position.set(1000, 1000, -1000)
            camera.lookAt(new THREE.Vector3())

            // 环境光
            const ambient = new THREE.HemisphereLight(0x333333)
            scene.add(ambient)

            // // 光源
            // const light = new THREE.DirectionalLight(0xb9d3ff)
            // light.position.set(0, 200, 10)
            // scene.add(light)

            // 地面
            const textureLoader = new THREE.TextureLoader()
            const material = new THREE.MeshLambertMaterial({
                color: 0x999999,
                map: textureLoader.load("./static/nitu.webp"),
                side: THREE.DoubleSide //两面可见
            })
            ground = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), material)
            ground.name = "ground"
            ground.receiveShadow = true
            ground.rotation.x = -Math.PI / 2
            const axisHelper = new THREE.AxesHelper(1000)
            ground.add(axisHelper)
            scene.add(ground)

            // 创建渲染器对象
            renderer = new THREE.WebGLRenderer({ antialias: true })
            renderer.setPixelRatio(window.devicePixelRatio)
            renderer.setSize(w, h)
            renderer.outputEncoding = THREE.sRGBEncoding
            renderer.setClearColor(0xb9d3ff, 1)
            renderer.shadowMap.enabled = true
            const container = document.getElementById("model")
            container.appendChild(renderer.domElement)
            stats.dom.style.position = "absolute"
            container.appendChild(stats.dom)

            controlsEvent()
            createGUI()
            animation()
        }

        const controlsEvent = () => {
            const controls = new OrbitControls(camera, renderer.domElement) //创建控件对象
            controls.addEventListener("change", () => {}) //监听鼠标、键盘事件
        }

        const createGUI = () => {
            const gui = new GUI()
            gui.domElement.style.position = "absolute"
            let emotes = {
                精灵图: false,
                帧动画: false,
                日照: false,
                自旋: false
            }
            let emoteFolder = gui.addFolder("操作")
            emoteFolder.add(emotes, "精灵图").onChange(treeChange)
            emoteFolder.add(emotes, "帧动画").onChange(spriteChange)
            emoteFolder.add(emotes, "日照").onChange(shadowChange)
            emoteFolder.add(emotes, "自旋").onChange(cameraChange)

            emoteFolder.open()
            tree = new TreeModel(scene)
            light = new LightShadow(scene)
            rotateCamera = new RotateCamera(ground)
        }

        const animation = () => {
            render()
            requestAnimationFrame(animation)
        }

        const render = () => {
            stats.update()
            renderer.render(scene, camera) //执行渲染操作
        }

        const treeChange = (e) => {
            e ? tree.init() : tree.remove()
        }
        const spriteChange = (e) => {
            e ? sprite() : clearSprite()
        }
        const shadowChange = (e) => {
            e ? light.init() : light.remove()
        }
        const cameraChange = (e) => {
            e ? rotateCamera.start() : rotateCamera.remove()
        }

        function TreeModel(ground) {
            this.ground = ground
            this.treeGroup = null
            this.init = () => {
                const textureTree = new THREE.TextureLoader().load("/static/tree.png")
                const treeGroup = new THREE.Group()
                for (let i = 0; i < 100; i++) {
                    const spriteMaterial = new THREE.SpriteMaterial({
                        map: textureTree
                    })
                    const sprite = new THREE.Sprite(spriteMaterial)
                    sprite.scale.set(100, 100, 1)
                    const x = Math.random() - 0.5
                    const z = Math.random() - 0.5
                    sprite.position.set(2000 * x, 50, 2000 * z)
                    treeGroup.add(sprite)
                }
                this.treeGroup = treeGroup
                this.ground.add(this.treeGroup)
            }
            this.remove = () => {
                this.ground.remove(this.treeGroup)
            }
        }

        const sprite = () => {
            spriteGroup = new THREE.Group()
            const textureTree = new THREE.TextureLoader().load("/static/rain.png")
            for (let i = 0; i < 1000; i++) {
                const spriteMaterial = new THREE.SpriteMaterial({
                    map: textureTree
                })
                const sprite = new THREE.Sprite(spriteMaterial)
                sprite.scale.set(8, 10, 1)
                const x = Math.random() - 0.5
                const y = Math.abs(Math.random() - 0.5)
                const z = Math.random() - 0.5
                sprite.position.set(2000 * x, 4000 * y, 2000 * z)
                spriteGroup.add(sprite)
            }
            scene.add(spriteGroup)
            sRender()
        }
        const sRender = () => {
            spriteGroup.children.forEach((sprite) => {
                sprite.position.y -= 1
                if (sprite.position.y < 0) {
                    sprite.position.y = 400
                }
            })
            render()
            spriteAn = requestAnimationFrame(sRender)
        }

        const clearSprite = () => {
            scene.remove(spriteGroup)
            render()
            cancelAnimationFrame(spriteAn)
        }

        function LightShadow(scene) {
            this.scene = scene
            this.directionalLight = null
            this.directionalLightHelper = null
            this.shadowMesh = null
            this.shadowAn = null
            this.clock = new THREE.Clock()
            this.timer = 0
            this.init = () => {
                const geometry = new THREE.BoxGeometry(40, 100, 40)
                const material = new THREE.MeshPhongMaterial({
                    color: 0xffffff
                })
                this.shadowMesh = new THREE.Mesh(geometry, material)
                this.shadowMesh.position.set(360, 50, 0)
                // 设置产生投影的网格模型
                this.shadowMesh.castShadow = true
                this.scene.add(this.shadowMesh)

                // 方向光
                this.directionalLight = new THREE.DirectionalLight(0xffffff, 1)
                // 设置光源位置
                this.directionalLight.position.set(0, 0, 0)
                this.directionalLightHelper = new THREE.DirectionalLightHelper(
                    this.directionalLight,
                    10,
                    0xffff00
                )
                const textureLoader = new THREE.TextureLoader()
                const meshSun = new THREE.MeshPhongMaterial({
                    map: textureLoader.load("./static/sun.jpeg")
                })
                this.sun = new THREE.Mesh(new THREE.SphereGeometry(50, 50, 50), meshSun)
                this.sun.position.set(0, 0, 0)
                this.sun.emissive = this.sun.color
                this.sun.emissiveMap = this.sun.map
                this.scene.add(this.sun)
                this.scene.add(this.directionalLightHelper)
                this.scene.add(this.directionalLight)
                // 设置用于计算阴影的光源对象
                this.directionalLight.castShadow = true
                // 设置计算阴影的区域，最好刚好紧密包围在对象周围
                // 计算阴影的区域过大：模糊  过小：看不到或显示不完整
                this.directionalLight.shadow.camera.near = 5
                this.directionalLight.shadow.camera.far = 5000
                this.directionalLight.shadow.camera.left = -5000
                this.directionalLight.shadow.camera.right = 5000
                this.directionalLight.shadow.camera.top = 5000
                this.directionalLight.shadow.camera.bottom = -5000
                // 设置mapSize属性可以使阴影更清晰，不那么模糊
                this.directionalLight.shadow.mapSize.set(10240, 10240)
                this.render()
            }
            this.render = () => {
                const delta = this.clock.getDelta()
                this.timer += delta / 50
                const x = 1000 * Math.cos(this.timer)
                const y = 1000 * Math.sin(this.timer)
                const z = 0
                this.directionalLight.position.set(x, y, z)
                this.sun.position.set(x, y, z)
                this.directionalLightHelper.update()
                render()
                this.shadowAn = requestAnimationFrame(this.render)
            }
            this.remove = () => {
                this.scene.remove(this.sun)
                this.scene.remove(this.shadowMesh)
                this.scene.remove(this.directionalLight)
                this.scene.remove(this.directionalLightHelper)
                render()
                cancelAnimationFrame(this.shadowAn)
            }
        }

        function RotateCamera(ground) {
            this.ground = ground
            this.clock = new THREE.Clock()
            this.timer = 0
            this.cameraAn = null
            this.x = 0
            this.y = 0
            this.z = 0
            this.start = () => {
                this.x = camera.position.x
                this.z = camera.position.z
                this.y = camera.position.y
                this.update()
            }
            this.update = () => {
                const delta = this.clock.getDelta()
                this.timer += delta / 5

                const x = this.y * Math.cos(this.timer)
                const z = this.y * Math.sin(this.timer)
                const y = this.y

                camera.position.set(x, y, z)
                camera.lookAt(new THREE.Vector3())
                render()
                this.cameraAn = requestAnimationFrame(this.update)
                stats.update()
            }
            this.remove = () => {
                cancelAnimationFrame(this.cameraAn)
            }
        }

        onMounted(() => {
            init()
        })
        onUnmounted(() => {
            renderer.forceContextLoss()
            renderer.dispose()
            renderer.domElement = null
            scene.clear()
            light.remove()
            if (document.getElementsByClassName("lil-gui")[0]) {
                document.getElementsByClassName("lil-gui")[0].remove()
            }
        })
    }
})
</script>

<style lang='scss' scoped>
.model-ca {
    position: relative;
}
</style>