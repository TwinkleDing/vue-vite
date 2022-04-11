<template>
    <div>
        <div id="model" class="model-ca" @keydown="keyDown"></div>
    </div>
</template>
<script>
import { onMounted, onUnmounted } from "vue"
import * as THREE from "three"
import Stats from "three/examples/jsm/libs/stats.module.js"
import { FlyControls } from "three/examples/jsm/controls/FlyControls.js"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js"

export default {
    name: "Earth1",
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
        const radius = 6371
        const tilt = 0.41
        const rotationSpeed = 0.02
        const cloudsScale = 1.005
        const moonScale = 0.23
        const MARGIN = 0
        const stats = new Stats()
        const textureLoader = new THREE.TextureLoader()
        const dMoonVec = new THREE.Vector3()
        const clock = new THREE.Clock()
        const renderer = new THREE.WebGLRenderer({ antialias: true }) // 抗锯齿

        let SCREEN_HEIGHT = window.innerHeight - MARGIN * 2
        let SCREEN_WIDTH = window.innerWidth
        let camera
        let controls
        let scene
        let meshPlanet
        let meshClouds
        let meshMoon
        let composer
        let d

        const init = () => {
            // 场景
            scene = new THREE.Scene()
            scene.fog = new THREE.FogExp2(0x000000, 0.00000025)

            // 相机
            camera = new THREE.PerspectiveCamera(25, SCREEN_WIDTH / SCREEN_HEIGHT, 50, 1e7)
            camera.position.z = radius * 5

            // 光源
            const dirLight = new THREE.DirectionalLight(0xffffff)
            dirLight.position.set(-1, 0, 1).normalize()
            scene.add(dirLight)

            const materialNormalMap = new THREE.MeshPhongMaterial({
                specular: 0x333333,
                shininess: 15,
                map: textureLoader.load("./static/planets/earth_atmos_2048.jpg"),
                specularMap: textureLoader.load("./static/planets/earth_specular_2048.jpg"),
                normalMap: textureLoader.load("./static/planets/earth_normal_2048.jpg"),

                // y scale is negated to compensate for normal map handedness.
                normalScale: new THREE.Vector2(0.85, -0.85)
            })

            // 地球
            const geometry = new THREE.SphereGeometry(radius, 100, 50)
            meshPlanet = new THREE.Mesh(geometry, materialNormalMap)
            meshPlanet.rotation.y = 0
            meshPlanet.rotation.z = tilt
            scene.add(meshPlanet)

            // 云
            const materialClouds = new THREE.MeshLambertMaterial({
                map: textureLoader.load("./static/planets/earth_clouds_1024.png"),
                transparent: true
            })
            meshClouds = new THREE.Mesh(geometry, materialClouds)
            meshClouds.scale.set(cloudsScale, cloudsScale, cloudsScale)
            meshClouds.rotation.z = tilt
            scene.add(meshClouds)

            // 月球
            const materialMoon = new THREE.MeshPhongMaterial({
                map: textureLoader.load("./static/planets/moon_1024.jpg")
            })
            meshMoon = new THREE.Mesh(geometry, materialMoon)
            meshMoon.position.set(radius * 5, 0, 0)
            meshMoon.scale.set(moonScale, moonScale, moonScale)
            scene.add(meshMoon)

            // 星星
            stars()

            renderer.setPixelRatio(window.devicePixelRatio)
            renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
            const container = document.getElementById("model")
            container.appendChild(renderer.domElement)
            stats.dom.style.position = "absolute"
            container.appendChild(stats.dom)
            window.addEventListener("resize", onWindowResize)

            const renderModel = new RenderPass(scene, camera)
            const effectFilm = new FilmPass(0.35, 0.75, 2048, false)
            composer = new EffectComposer(renderer)
            composer.addPass(renderModel)
            composer.addPass(effectFilm)
            controlsEvent()
        }
        const stars = () => {
            const r = radius
            const starsGeometry = [new THREE.BufferGeometry(), new THREE.BufferGeometry()]
            const vertices1 = []
            const vertices2 = []
            const vertex = new THREE.Vector3()
            for (let i = 0; i < 250; i++) {
                vertex.x = Math.random() * 2 - 1
                vertex.y = Math.random() * 2 - 1
                vertex.z = Math.random() * 2 - 1
                vertex.multiplyScalar(r)

                vertices1.push(vertex.x, vertex.y, vertex.z)
            }
            for (let i = 0; i < 1500; i++) {
                vertex.x = Math.random() * 2 - 1
                vertex.y = Math.random() * 2 - 1
                vertex.z = Math.random() * 2 - 1
                vertex.multiplyScalar(r)

                vertices2.push(vertex.x, vertex.y, vertex.z)
            }
            starsGeometry[0].setAttribute(
                "position",
                new THREE.Float32BufferAttribute(vertices1, 3)
            )
            starsGeometry[1].setAttribute(
                "position",
                new THREE.Float32BufferAttribute(vertices2, 3)
            )
            const starsMaterials = [
                new THREE.PointsMaterial({ color: 0x555555, size: 2, sizeAttenuation: false }),
                new THREE.PointsMaterial({ color: 0x555555, size: 1, sizeAttenuation: false }),
                new THREE.PointsMaterial({ color: 0x333333, size: 2, sizeAttenuation: false }),
                new THREE.PointsMaterial({ color: 0x3a3a3a, size: 1, sizeAttenuation: false }),
                new THREE.PointsMaterial({ color: 0x1a1a1a, size: 2, sizeAttenuation: false }),
                new THREE.PointsMaterial({ color: 0x1a1a1a, size: 1, sizeAttenuation: false })
            ]
            for (let i = 10; i < 30; i++) {
                const stars = new THREE.Points(starsGeometry[i % 2], starsMaterials[i % 6])

                stars.rotation.x = Math.random() * 6
                stars.rotation.y = Math.random() * 6
                stars.rotation.z = Math.random() * 6
                stars.scale.setScalar(i * 10)

                stars.matrixAutoUpdate = false
                stars.updateMatrix()

                scene.add(stars)
            }
        }

        const controlsEvent = () => {
            controls = new FlyControls(camera, renderer.domElement)
            controls.movementSpeed = 1
            controls.domElement = renderer.domElement
            controls.rollSpeed = Math.PI / 24
            controls.autoForward = false
            controls.dragToLook = true
        }

        const onWindowResize = () => {
            SCREEN_HEIGHT = window.innerHeight
            SCREEN_WIDTH = window.innerWidth
            camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT
            camera.updateProjectionMatrix()
            renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
            composer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
        }

        const animate = () => {
            requestAnimationFrame(animate)
            render()
            stats.update()
        }

        const render = () => {
            // 旋转地球和云
            const delta = clock.getDelta()
            meshPlanet.rotation.y += rotationSpeed * delta
            meshClouds.rotation.y += 1.25 * rotationSpeed * delta

            // 当我们接近地面时要减速
            const dPlanet = camera.position.length()
            dMoonVec.subVectors(camera.position, meshMoon.position)
            const dMoon = dMoonVec.length()
            if (dMoon < dPlanet) {
                d = dMoon - radius * moonScale * 1.01
            } else {
                d = dPlanet - radius * 1.01
            }

            controls.movementSpeed = 0.33 * d
            controls.update(delta)
            composer.render(delta)
        }
        onMounted(() => {
            init()
            animate()
        })
        onUnmounted(() => {
        })
    }
}
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