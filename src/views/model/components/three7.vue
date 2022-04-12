<template>
    <div>
        <div id="model" class="model-ca"></div>
    </div>
</template>

<script>
import { defineComponent, onMounted, onUnmounted } from "vue"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

export default defineComponent({
    name: "Models",
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
        let scene
        let camera
        let renderer
        const clock = new THREE.Clock()
        let timer = 0
        const init = () => {
            // 创建场景
            scene = new THREE.Scene()

            // 创建坐标系
            const axisHelper = new THREE.AxesHelper(1000)
            scene.add(axisHelper)

            // 创建相机
            const w = props.width
            const h = props.height

            // 透视相机
            camera = new THREE.PerspectiveCamera(45, w / h, 0.01, 100000)
            camera.position.set(-200, 150, 150)
            camera.lookAt(new THREE.Vector3(30, 10, 20))

            // 环境光
            const ambient = new THREE.HemisphereLight(0x999999)
            ambient.position.set(200, 200, 200)
            scene.add(ambient)

            // // 光源
            // const light = new THREE.DirectionalLight(0xb9d3ff)
            // light.position.set(0, 200, 10)
            // scene.add(light)

            // 地面
            const material = new THREE.MeshPhongMaterial({
                color: 0x999999,
                side: THREE.DoubleSide //两面可见
            })
            const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), material)
            mesh.name = "ground"
            mesh.receiveShadow = true
            mesh.rotation.x = -Math.PI / 2
            scene.add(mesh)
            yy()

            // 创建渲染器对象
            renderer = new THREE.WebGLRenderer({ antialias: true })
            renderer.setPixelRatio(window.devicePixelRatio)
            renderer.setSize(w, h)
            renderer.outputEncoding = THREE.sRGBEncoding
            renderer.setClearColor(0xb9d3ff, 1)
            renderer.shadowMap.enabled = true
            document.getElementById("model").appendChild(renderer.domElement)

            render()
            controlsEvent()

            tree() //雪碧图复制
            sprite() //雪碧图帧动画
        }
        const tree = () => {
            const textureTree = new THREE.TextureLoader().load("/static/tree.png")
            for (let i = 0; i < 100; i++) {
                const spriteMaterial = new THREE.SpriteMaterial({
                    map: textureTree
                })
                const sprite = new THREE.Sprite(spriteMaterial)
                scene.add(sprite)
                sprite.scale.set(100, 100, 1)
                const x = Math.random() - 0.5
                const z = Math.random() - 0.5
                sprite.position.set(2000 * x, 50, 2000 * z)
            }
        }
        const sprite = () => {
            const group = new THREE.Group()
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
                group.add(sprite)
            }
            scene.add(group)
            const sRender = () => {
                group.children.forEach((sprite) => {
                    sprite.position.y -= 1
                    if (sprite.position.y < 0) {
                        sprite.position.y = 400
                    }
                })
                render()
                requestAnimationFrame(sRender)
            }
            sRender()
        }
        const render = () => {
            renderer.render(scene, camera) //执行渲染操作
        }
        // 控制器
        const controlsEvent = () => {
            const controls = new OrbitControls(camera, renderer.domElement) //创建控件对象
            controls.autoRotate = true
            controls.addEventListener("change", () => {
                console.log(1) 
            }) //监听鼠标、键盘事件
            
            controls.update(clock.getDelta())
            // update()
        }
        const yy = () => {
            var geometry = new THREE.BoxGeometry(40, 100, 40)
            var material = new THREE.MeshLambertMaterial({
                color: 0xffffff
            })
            var mesh = new THREE.Mesh(geometry, material)
            mesh.position.set(360, 50, 0)
            // 设置产生投影的网格模型
            mesh.castShadow = true
            scene.add(mesh)

            let x = 800
            let y = 800
            let z = 800
            // 方向光
            var directionalLight = new THREE.DirectionalLight(0xffffff, 1)
            // 设置光源位置
            directionalLight.position.set(x, y, z)
            var directionalLightHelper = new THREE.DirectionalLightHelper(
                directionalLight,
                10,
                0xff0000
            )
            scene.add(directionalLightHelper)
            scene.add(directionalLight)
            // 设置用于计算阴影的光源对象
            directionalLight.castShadow = true
            // 设置计算阴影的区域，最好刚好紧密包围在对象周围
            // 计算阴影的区域过大：模糊  过小：看不到或显示不完整
            directionalLight.shadow.camera.near = 5
            directionalLight.shadow.camera.far = 5 * x
            directionalLight.shadow.camera.left = -5 * x
            directionalLight.shadow.camera.right = 5 * x
            directionalLight.shadow.camera.top = 5 * x
            directionalLight.shadow.camera.bottom = -5 * x
            // 设置mapSize属性可以使阴影更清晰，不那么模糊
            directionalLight.shadow.mapSize.set(10240, 10240)
        }

        const updateCamera = (delta) => {
            timer += delta / 5

            var x = 300 * Math.cos(timer)
            var z = 300 * Math.sin(timer)
            var y = 200

            camera.position.set(x, y, z)
            camera.lookAt(new THREE.Vector3())
        }
        const update = () => {
            var delta = clock.getDelta()
            updateCamera(delta)
            renderer.render(scene, camera)
            requestAnimationFrame(update) //不会卡塞，专门针对图形渲染刷新的方法
        }

        onMounted(() => {
            init()
        })
        onUnmounted(() => {
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