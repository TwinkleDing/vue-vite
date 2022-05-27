<template>
    <div>
        <div id="model" class="model-ca" @keydown="keyDown"></div>
    </div>
</template>

<script >
import { onMounted } from "vue"
import { useStore } from "vuex"
import * as THREE from "three"
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
        const store = useStore()
        const SCREEN_HEIGHT = props.height
        const SCREEN_WIDTH = props.width
        const SEPARATION = 100
        const AMOUNTX = 50
        const AMOUNTY = 50

        let container
        let camera
        let scene
        let renderer
        let particles
        let count = 0
        let mouseX = 0
        let mouseY = 0
        let windowHalfX = SCREEN_WIDTH / 2
        let windowHalfY = SCREEN_HEIGHT / 2

        const init = () => {
            camera = new THREE.PerspectiveCamera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000)
            camera.position.z = 1000
            scene = new THREE.Scene()
            const numParticles = AMOUNTX * AMOUNTY
            const positions = new Float32Array(numParticles * 3)
            const scales = new Float32Array(numParticles)
            let i = 0,
                j = 0
            for (let ix = 0; ix < AMOUNTX; ix++) {
                for (let iy = 0; iy < AMOUNTY; iy++) {
                    positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2 // x
                    positions[i + 1] = 0 // y
                    positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2 // z

                    scales[j] = 1

                    i += 3
                    j++
                }
            }
            const geometry = new THREE.BufferGeometry()
            geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
            geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1))

            const material = new THREE.ShaderMaterial({
                uniforms: {
                    color: { value: new THREE.Color(store.getters.systemTheme) }
                },
                vertexShader: `
                    attribute float scale;
                    void main() {
                        vec4 mvPosition = modelViewMatrix * vec4( position, 2.0 );
                        gl_PointSize = scale * ( 300.0 / - mvPosition.z );
                        gl_Position = projectionMatrix * mvPosition;
                    }
                    `,
                fragmentShader: `
                    uniform vec3 color;
                    void main() {
                        if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
                        gl_FragColor = vec4( color, 1.0 );
                    }
                `
            })
            particles = new THREE.Points(geometry, material)
            scene.add(particles)
            renderer = new THREE.WebGLRenderer({ antialias: true })
            renderer.setPixelRatio(window.devicePixelRatio)
            renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
            container = document.getElementById("model")
            container.appendChild(renderer.domElement)

            container.style.touchAction = "none"
            container.addEventListener("pointermove", onPointerMove)
            window.addEventListener("resize", onWindowResize)
        }

        const onWindowResize = () => {
            windowHalfX = SCREEN_WIDTH / 2
            windowHalfY = SCREEN_HEIGHT / 2
            camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT
            camera.updateProjectionMatrix()
            renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
        }
        const onPointerMove = (event) => {
            if (event.isPrimary === false) return

            mouseX = event.clientX - windowHalfX
            mouseY = event.clientY - windowHalfY
        }
        const animate = () => {
            requestAnimationFrame(animate)
            render()
        }

        const render = () => {
            camera.position.x += (mouseX - camera.position.x) * 0.05
            camera.position.y += (-mouseY - camera.position.y) * 0.05
            camera.lookAt(scene.position)
            const positions = particles.geometry.attributes.position.array
            const scales = particles.geometry.attributes.scale.array
            let i = 0
            let j = 0

            for (let ix = 0; ix < AMOUNTX; ix++) {
                for (let iy = 0; iy < AMOUNTY; iy++) {
                    positions[i + 1] =
                        Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50

                    scales[j] =
                        (Math.sin((ix + count) * 0.3) + 1) * 20 +
                        (Math.sin((iy + count) * 0.5) + 1) * 20

                    i += 3
                    j++
                }
            }

            particles.geometry.attributes.position.needsUpdate = true
            particles.geometry.attributes.scale.needsUpdate = true
            renderer.render(scene, camera)
            count += 0.1
        }
        onMounted(() => {
            init()
            animate()
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