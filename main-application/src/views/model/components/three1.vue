<template>
    <div>
        <div id="box" class="box"></div>
        <el-button @click="changeQ">添加球</el-button>
    </div>
</template>

<script>
import { defineComponent, onMounted, onUnmounted } from "vue"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

export default defineComponent({
    name: "Three1",
    data() {
        return {
            scene: {},
            geometry: {},
            camera: {},
            mesh: {},
            renderer: {},
            render: {},
            controls: {},
            axisHelper: {}
        }
    },
    setup() {
        let scene
        let geometry
        let camera
        let mesh
        let renderer
        let render
        let controls
        let axisHelper

        const initThree =()=> {
            // 创建场景对象Scene
            scene = new THREE.Scene()
            // 创建网格模型
            // geometry = new THREE.BoxGeometry(100, 100, 100) // 创建一个立方体几何对象
            geometry = new THREE.SphereGeometry(60, 40, 40); // 创建一个球体几何对象
            geometry.groups.forEach((face) => {
                // 设置三角面face三个顶点的颜色
                face.vertexColors = [
                    new THREE.Color(0xffff00),
                    new THREE.Color(0xff00ff),
                    new THREE.Color(0x00ffff)
                ]
            })

            // Lambert网格材质，与光照有反应，漫反射
            let material = new THREE.MeshLambertMaterial({
                vertexColors: THREE.VertexColors //以顶点颜色为准
                // color: 0x0000ff,
                // opacity:0.7,
                // transparent:true
            })
            mesh = new THREE.Mesh(geometry, material) //网格模型对象Mesh
            mesh.position.set(-50, 50, -50) // 设置mesh2模型对象的xyz坐标为120,0,0

            scene.add(mesh) // 网格模型添加到场景中

            // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
            axisHelper = new THREE.AxisHelper(500)
            scene.add(axisHelper)

            // 光源设置
            // 点光源
            let point = new THREE.PointLight(0xffffff)
            point.position.set(100, 200, -200) // 点光源位置   z←y↑x→
            scene.add(point) // 点光源添加到场景中
            // 环境光
            let ambient = new THREE.AmbientLight(0x444444)
            scene.add(ambient) // 设置环境光

            // 相机设置
            let width = 400 // 窗口宽度
            let height = 300 // 窗口高度
            let k = width / height // 窗口宽高比
            let s = 200 // 三位场景显示范围控制系数，系数越大，显示的范围越大
            // 创建相机对象
            camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)
            camera.position.set(400, 400, -400) //设置相机位置
            camera.lookAt(scene.position) //设置相机方向（指向的场景反向）

            // 创建渲染器对象
            renderer = new THREE.WebGLRenderer()
            renderer.setSize(width, height) // 设置渲染器区域尺寸
            renderer.setClearColor(0xb9d3ff, 1) //设置背景颜色
            document.getElementById("box").appendChild(renderer.domElement) //插入canvas对象
            // 执行渲染操作 指定场景、相机作为参数
            // renderer.render(scene, camera);
            render = () => {
                renderer.render(scene, camera) //执行渲染操作
            }
            render()
            controls = new OrbitControls(camera, renderer.domElement) //创建控件对象
            controls.addEventListener("change", render) //监听鼠标、键盘事件
            // 旋转动画
            // animation();
        }
        const animation=()=> {
            /*
        注意网格模型Mesh进行缩放旋转平移变换和几何体Geometry可以实现相同的渲染效果，
        但是网格模型Mesh进行这些变换不会影响几何体的顶点位置坐标，
        网格模型缩放旋转平移变换改变的是模型的本地矩阵、世界矩阵。
      */
            // .scale()、.translate()、.rotateX()等方法可以对几何体本身进行缩放、平移、旋转
            renderer.render(scene, camera) //执行渲染操作
            // mesh.rotateX(0.01);//每次绕y轴旋转0.01弧度
            // mesh.rotateY(0.01);//每次绕y轴旋转0.01弧度
            mesh.rotateZ(0.01) //每次绕y轴旋转0.01弧度
            geometry.rotateZ(0.01) //每次绕y轴旋转0.01弧度
            requestAnimationFrame(animation) //请求再次执行渲染函数render
        }
        const changeQ=()=> {
            // 球体网格模型
            let geometry2 = new THREE.SphereGeometry(60, 40, 40)
            // 高光Phong材质,与光照有反应
            let sphereMaterial = new THREE.MeshPhongMaterial({
                color: 0x0000ff,
                specular: 0x4488ee,
                shininess: 12
            })
            let mesh2 = new THREE.Mesh(geometry2, sphereMaterial) // 网格模型对象Mesh
            mesh2.translateY(120) // 球体网格模型沿Y轴正方向平移120
            // mesh2.position.set(120,0,0);// 设置mesh2模型对象的xyz坐标为120,0,0
            scene.add(mesh2)
            render()
        }
        
        onMounted(() => {
            initThree()
        })
        onUnmounted(() => {
            document.getElementsByClassName("lil-gui")[0].remove()
        })

        return {
            changeQ
        }
    }
})
</script>

<style lang='scss' scoped>
.box {
    height: 300px;
}
</style>