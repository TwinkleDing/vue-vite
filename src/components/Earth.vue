<template>
    <div>
        <div id="model" class="model-ca"></div>
    </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from "vue"
import * as THREE from "three"
export default defineComponent({
    name: "Earth",
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
        let scene: any
        let camera: any
        let renderer: any
        const init = () => {
            scene = new THREE.Scene()

            const w = props.width
            const h = props.height

            camera = new THREE.PerspectiveCamera(45, w / h, 0.01, 100000)
            camera.position.set(0, 300, 400)
            camera.lookAt(new THREE.Vector3(30, 10, 20))

            const ambient = new THREE.HemisphereLight(0x999999)
            ambient.position.set(200, 200, 200)
            scene.add(ambient)

            // 光源
            const light = new THREE.DirectionalLight(0xb9d3ff)
            light.position.set(1, 0, 0)
            scene.add(light)

            // 创建渲染器对象
            renderer = new THREE.WebGLRenderer({ antialias: true })
            renderer.setPixelRatio(window.devicePixelRatio)
            renderer.setSize(w, h)
            renderer.outputEncoding = THREE.sRGBEncoding
            renderer.setClearColor(0xb9d3ff, 1)
            renderer.shadowMap.enabled = true
            document.getElementById("model").appendChild(renderer.domElement)

            render()
            earth()
        }

        // 单击控制
        const earth = () => {
            const geometry = new THREE.SphereGeometry(100, 25, 25) //球体
            // 加载资源
            const textureLoader = new THREE.TextureLoader()
            // 加载纹理贴图
            const texture = textureLoader.load("./static/sr111.webp")
            // 加载法线贴图
            const textureNormal = textureLoader.load("./static/EarthNormal.png")
            const material = new THREE.MeshPhongMaterial({
                map: texture,
                normalMap: textureNormal,
                //设置深浅程度，默认值(1,1)。
                normalScale: new THREE.Vector2(1, 1)
            })
            const mesh = new THREE.Mesh(geometry, material)
            mesh.rotateZ(-0.5) // 黄赤夹角

            const sRender = () => {
                mesh.rotateY(0.005) // 模拟自转
                render()
                requestAnimationFrame(sRender)
            }
            sRender()
            scene.add(mesh)
        }
        const render = () => {
            renderer.render(scene, camera)
        }
        onMounted(() => {
            init()
        })
    }
})
</script>

<style scoped>
</style>