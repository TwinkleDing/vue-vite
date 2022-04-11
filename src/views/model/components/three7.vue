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
        let meshDoor
        let speed = 1
        let open = true
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

            // // 环境光
            // const ambient = new THREE.HemisphereLight(0xff0000)
            // ambient.position.set(200, 200, 200)
            // scene.add(ambient)

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

            keyDowns() // 单击变色
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
        const animation = () => {
            //圆周运动
            if (!meshDoor) {
                return false
            }
            const w = 20 // 主要管理半径，会影响位置
            const x = 0 // 主要管理位置X
            const z = 20 // 主要管理位置Z

            speed += Math.PI / 180
            const angle = speed
            meshDoor.rotation.y = Math.PI - angle // 指向圆心
            const a = (x + w) / 2 + (-w / 2) * (1 - Math.cos(angle)) // 因为初始位X值设为了零
            const b = 20
            const c = z / 2 + (w / 2) * Math.sin(Math.abs(angle))
            meshDoor.position.set(a, b, c)
            requestAnimationFrame(animation)
            render()
        }
        const render = () => {
            renderer.render(scene, camera) //执行渲染操作
        }
        // 控制器
        const controlsEvent = () => {
            const controls = new OrbitControls(camera, renderer.domElement) //创建控件对象
            controls.addEventListener("change", render) //监听鼠标、键盘事件
        }
        // 单击控制
        const keyDowns = () => {
            const geometry = new THREE.SphereGeometry(25, 100, 100)
            const cube = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x00ff00 }))
            cube.position.set(100, 25, 100)
            cube.name = "box"
            cube.castShadow = true
            scene.add(cube)
            //点击射线
            document
                .getElementById("model")
                .addEventListener("mousedown", onDocumentMouseDown, false)
            function onDocumentMouseDown(event) {
                event.preventDefault()
                const intersects = getIntersects(event)
                if (intersects.length > 0) {
                    if (intersects[0].object.name === "box") {
                        var material = new THREE.PointsMaterial({
                            color: 0xff0000,
                            side: THREE.DoubleSide, //两面可见
                            size: 1.0 //点对象像素尺寸
                        })
                        intersects[0].object.material = material
                    }
                } else {
                    cube.material = new THREE.MeshPhongMaterial({ color: 0xffff00 })
                }
            }
        }
        const getIntersects = (event) => {
            const raycaster = new THREE.Raycaster()
            const mouse = new THREE.Vector2()
            mouse.x = (event.layerX / renderer.domElement.clientWidth) * 2 - 1
            mouse.y = -(event.layerY / renderer.domElement.clientHeight) * 2 + 1
            raycaster.setFromCamera(mouse, camera)
            const intersects = raycaster.intersectObjects(scene.children, true)
            return intersects
        }

        const yy = () => {
            var geometry = new THREE.BoxGeometry(40, 100, 40)
            var material = new THREE.MeshLambertMaterial({
                color: 0xffffff
            })
            var mesh = new THREE.Mesh(geometry, material)
            mesh.position.set(160, 100, 0)
            // 设置产生投影的网格模型
            mesh.castShadow = true
            scene.add(mesh)

            let x = 160
            let y = 200
            let z = 0
            var geometry1 = new THREE.BoxGeometry(10, 10, 10)
            var material1 = new THREE.MeshLambertMaterial({
                color: 0xff0000
            })
            var mesh1 = new THREE.Mesh(geometry1, material1)
            mesh1.castShadow = true
            mesh1.position.set(x, y, z)
            scene.add(mesh1)
            // 方向光
            var directionalLight = new THREE.DirectionalLight(0xffffff, 1)
            // 设置光源位置
            directionalLight.position.set(x, y, z)
            scene.add(directionalLight)
            // 设置用于计算阴影的光源对象
            directionalLight.castShadow = true
            // 设置计算阴影的区域，最好刚好紧密包围在对象周围
            // 计算阴影的区域过大：模糊  过小：看不到或显示不完整
            directionalLight.shadow.camera.near = 5
            directionalLight.shadow.camera.far = 300
            directionalLight.shadow.camera.left = -y
            directionalLight.shadow.camera.right = y
            directionalLight.shadow.camera.top = y
            directionalLight.shadow.camera.bottom = -y
            // 设置mapSize属性可以使阴影更清晰，不那么模糊
            directionalLight.shadow.mapSize.set(1024, 1024)
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