<template>
    <div>
        <div id="model" class="model-ca"></div>
    </div>
</template>

<script>
import { onMounted, onUnmounted } from "vue"
import * as THREE from "three"
import Stats from "three/examples/jsm/libs/stats.module.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

export default {
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
        let stats
        let meshDoor
        let speed
        const init = () => {
            // 创建场景
            scene = new THREE.Scene()
            // scene.background = new THREE.Color(0xe0e0e0);
            // scene.fog = new THREE.Fog(0xe0e0e0, 20, 100); // 雾化背景

            // 创建坐标系
            let axisHelper = new THREE.AxesHelper(1000)
            scene.add(axisHelper)

            // 创建相机
            let w = props.width
            let h = props.height
            // let k = w / h;
            // let s = 200; // 三位场景显示范围控制系数，系数越大，显示的范围越大
            // // 正投影相机
            // camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);

            // 透视相机
            camera = new THREE.PerspectiveCamera(45, w / h, 0.01, 100000)
            //
            camera.position.set(-200, 150, 150)
            camera.lookAt(new THREE.Vector3(30, 10, 20))

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
            const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(200, 200), material)
            mesh.name = "ground"
            mesh.rotation.x = -Math.PI / 2
            scene.add(mesh)

            // 网格
            const grid = new THREE.GridHelper(200, 40, 0xff0000, 0x000000)
            grid.name = "GridHelper"
            grid.material.opacity = 0.2
            grid.material.transparent = true
            scene.add(grid)

            // 创建渲染器对象
            renderer = new THREE.WebGLRenderer({ antialias: true })
            renderer.setPixelRatio(window.devicePixelRatio)
            renderer.setSize(w, h)
            renderer.outputEncoding = THREE.sRGBEncoding
            renderer.setClearColor(0xb9d3ff, 1)
            document.getElementById("model").appendChild(renderer.domElement)

            stats = new Stats()
            document.getElementById("model").appendChild(stats.dom)
            render()
            controlsEvent()
            simianti();
            ding();
            newBox();
            keyDowns();
            xuanZhuan();
            tree();
            sprite();
        }
        const tree = () => {
            let textureTree = new THREE.TextureLoader().load("/static/tree.png")
            for (let i = 0; i < 100; i++) {
                let spriteMaterial = new THREE.SpriteMaterial({
                    map: textureTree
                })
                let sprite = new THREE.Sprite(spriteMaterial)
                scene.add(sprite)
                sprite.scale.set(100, 100, 1)
                let k1 = Math.random() - 0.5
                let k2 = Math.random() - 0.5
                sprite.position.set(1000 * k1, 50, 1000 * k2)
            }
        }
        const sprite = () => {
            let group = new THREE.Group()
            let textureTree = new THREE.TextureLoader().load("/static/rain.png")
            for (let i = 0; i < 1000; i++) {
                let spriteMaterial = new THREE.SpriteMaterial({
                    map: textureTree
                })
                let sprite = new THREE.Sprite(spriteMaterial)
                group.add(sprite)
                sprite.scale.set(8, 10, 1)
                let k1 = Math.random() - 0.5
                let k2 = Math.random() - 0.5
                let k3 = Math.random() - 0.5
                sprite.position.set(1000 * k1, 400 * k2, 1000 * k3)
            }
            scene.add(group)
            let arender = () => {
                group.children.forEach((sprite) => {
                    sprite.position.y -= 1
                    if (sprite.position.y < -200) {
                        sprite.position.y = 200
                    }
                })
                render()
                requestAnimationFrame(arender)
            }
            arender()
        }
        const xuanZhuan = () => {
            let points = [
                new THREE.Vector2(50, 60),
                new THREE.Vector2(25, 0),
                new THREE.Vector2(50, -60)
            ]
            let geometry = new THREE.LatheGeometry(points, 30, 0, Math.PI)
            let material = new THREE.MeshPhongMaterial({
                color: 0x0000ff, //三角面颜色
                side: THREE.DoubleSide //两面可见
            }) //材质对象
            material.wireframe = true //线条模式渲染(查看细分数)
            let mesh = new THREE.Mesh(geometry, material) //旋转网格模型对象
            scene.add(mesh) //旋转网格模型添加到场景中
        }
        const newBox = () => {
            let geometry = new THREE.BufferGeometry() //创建一个Buffer类型几何体对象
            //类型数组创建顶点数据
            let vertices = new Float32Array([
                80, 0, 50, 80, 0, -50, -80, 0, -50, -80, 0, 50,

                80, 60, 50, 80, 60, -50, -80, 60, -50, -80, 60, 50
            ])
            let attribue = new THREE.BufferAttribute(vertices, 3) //3个为一组，表示一个顶点的xyz坐标
            //类型数组创建顶点颜色color数据
            let colors = new Float32Array([
                0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1
            ])
            geometry.attributes.color = new THREE.BufferAttribute(colors, 3)
            geometry.attributes.position = attribue
            let material = new THREE.PointsMaterial({
                vertexColors: THREE.VertexColors, //以顶点颜色为准
                // color: 0x4a90e2,
                side: THREE.DoubleSide, //两面可见
                size: 1.0 //点对象像素尺寸
            }) //材质对象
            let indexes = new Uint16Array([
                // 0对应第1个顶点位置数据、第1个顶点法向量数据
                // 1对应第2个顶点位置数据、第2个顶点法向量数据
                // 索引值3个为一组，表示一个三角形的3个顶点
                0, 1, 2, 0, 2, 3, 0, 4, 5, 0, 5, 1, 0, 4, 7, 0, 7, 3,
                // 2, 6, 7,
                // 2, 7, 3,
                2, 6, 5, 2, 5, 1, 4, 7, 6, 4, 6, 5
            ])
            // 索引数据赋值给几何体的index属性
            geometry.index = new THREE.BufferAttribute(indexes, 1) //1个为一组
            let mesh = new THREE.Mesh(geometry, material) //网格模型对象Mesh
            mesh.name = "house"
            let mss = new THREE.PointsMaterial({
                color: 0xaacc00,
                side: THREE.DoubleSide //两面可见
            }) //材质对象
            let mss1 = new THREE.PointsMaterial({
                // color: 0xaacc00,
                side: THREE.DoubleSide //两面可见
            }) //材质对象
            let group = new THREE.Group()
            let w = 20
            let h = 40
            let z = 20 // z轴坐标
            meshDoor = new THREE.Mesh(new THREE.PlaneBufferGeometry(w, h), mss)
            meshDoor.position.set(0, 0, z / 2)

            let meshL = new THREE.Mesh(new THREE.PlaneBufferGeometry(40, 60), mss1)
            meshL.name = "door1"
            meshL.position.set(0, 30, 30)
            meshL.rotation.y = Math.PI / 2

            let meshR = new THREE.Mesh(new THREE.PlaneBufferGeometry(40, 60), mss1)
            meshR.name = "door2"
            meshR.position.set(0, 30, -30)
            meshR.rotation.y = Math.PI / 2

            let meshH = new THREE.Mesh(new THREE.PlaneBufferGeometry(20, 20), mss1)
            meshH.name = "door3"
            meshH.position.set(0, 50, 0)
            meshH.rotation.y = Math.PI / 2

            group.add(meshDoor, meshL, meshR, meshH)
            group.position.set(-80, 0, 0)
            let axisHelper = new THREE.AxesHelper(1000)
            group.add(axisHelper)
            let house = new THREE.Group()
            house.add(group, mesh)
            house.position.set(200, 200, 200)

            scene.add(house) // 网格模型添加到场景中
            animation(meshDoor, z, w)
        }
        const animation = () => {
            //圆周运动
            if (!meshDoor) {
                return false
            }
            let w = 20 // 主要管理半径，会影响位置
            let x = 0 // 主要管理位置X
            let z = 20 // 主要管理位置Z
            speed += Math.PI / 180
            let angle = speed
            meshDoor.rotation.y = Math.PI - angle // 指向圆心
            let a = (x + w) / 2 + (-w / 2) * (1 - Math.cos(angle)) // 因为初始位X值设为了零
            let b = 20
            let c = z / 2 + (w / 2) * Math.sin(Math.abs(angle))
            meshDoor.position.set(a, b, c)
            requestAnimationFrame(animation)
            render()
            stats.update()
        }
        const ding = () => {
            let material = new THREE.MeshBasicMaterial({
                color: 0x4a90e2,
                side: THREE.DoubleSide //两面可见
            })
            let geometryH = new THREE.BoxGeometry(100, 10, 10)
            let geometryS = new THREE.BoxGeometry(10, 10, 100)
            let geometryG = new THREE.BoxGeometry(10, 10, 30)

            let meshH = new THREE.Mesh(geometryH, material)
            let meshS = new THREE.Mesh(geometryS, material)
            let meshG = new THREE.Mesh(geometryG, material)

            meshS.position.set(0, 0, 50)
            meshG.position.set(-15.5, 0, 87)
            meshG.rotateY(45)

            let group = new THREE.Group()
            // let axisHelper = new THREE.AxesHelper(1000);
            // group.add(axisHelper);
            group.add(meshH, meshS, meshG)
            group.position.set(200, 200, -200)
            group.name = "ding"
            scene.add(group)
            let ground = group.clone()
            ground.rotateX(Math.PI / 2)
            scene.add(ground)

            scene.updateMatrixWorld(true)

            var worldPosition = new THREE.Vector3()
            meshS.getWorldPosition(worldPosition)
            console.log("世界坐标", worldPosition)
        }
        const simianti = () => {
            let geometry = new THREE.BufferGeometry() //创建一个Buffer类型几何体对象
            //类型数组创建顶点数据
            let vertices = new Float32Array([
                200, 0, -200, 200, 100, -200, 250, 0, -200, 200, 0, -300
            ])
            let attribue = new THREE.BufferAttribute(vertices, 3) //3个为一组，表示一个顶点的xyz坐标
            geometry.attributes.position = attribue
            let material = new THREE.PointsMaterial({
                color: 0x4a90e2,
                side: THREE.DoubleSide, //两面可见
                size: 1.0 //点对象像素尺寸
            }) //材质对象
            let indexes = new Uint16Array([
                // 0对应第1个顶点位置数据、第1个顶点法向量数据
                // 1对应第2个顶点位置数据、第2个顶点法向量数据
                // 索引值3个为一组，表示一个三角形的3个顶点
                0, 1, 2, 0, 2, 3, 0, 1, 3, 1, 2, 3
            ])
            // 索引数据赋值给几何体的index属性
            geometry.index = new THREE.BufferAttribute(indexes, 1) //1个为一组
            let mesh = new THREE.Mesh(geometry, material) //网格模型对象Mesh
            mesh.name = "zhui"
            scene.add(mesh) // 网格模型添加到场景中
        }
        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
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
            let geometry = new THREE.SphereGeometry(25, 100, 100)
            let cube = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x00ff00 }))
            cube.name = "box"
            scene.add(cube)
            //点击射线
            document
                .getElementById("model")
                .addEventListener("mousedown", onDocumentMouseDown, false)
            function onDocumentMouseDown(event) {
                event.preventDefault()
                let intersects = getIntersects(event)
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
            document.getElementById("model").addEventListener("keydown", onKeyDown, false)
            function onKeyDown(event) {
                console.log(event.keyCode)
                // if(event.keyCode === 87) {
                // }
            }
        }
        const getIntersects = (event) => {
            let raycaster = new THREE.Raycaster()
            let mouse = new THREE.Vector2()
            mouse.x = (event.layerX / renderer.domElement.clientWidth) * 2 - 1
            mouse.y = -(event.layerY / renderer.domElement.clientHeight) * 2 + 1
            raycaster.setFromCamera(mouse, camera)
            let intersects = raycaster.intersectObjects(scene.children, true)
            return intersects
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
</style>