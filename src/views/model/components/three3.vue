<template>
    <div>
        <div id='box3' class='box'></div>
    </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default {
    name: "Three3",
    data() {
        return {
            scene: {},
            geometry: {},
            camera: {},
            mesh: {},
            renderer: {},
            render: {},
            controls: {}
        };
    },
    computed: {

    },
    mounted() {
        this.initThree();
    },
    methods: {
        initThree() {
            // 创建场景对象Scene
            this.scene = new THREE.Scene();
            var points = [
                new THREE.Vector2(-50, -50),
                new THREE.Vector2(-60, 0),
                new THREE.Vector2(0, 50),
                new THREE.Vector2(60, 0),
                new THREE.Vector2(50, -50),
                new THREE.Vector2(-50, -50),
            ];
            // 创建网格模型
            this.geometry = new THREE.LatheGeometry(points, 30);
            let material = new THREE.LineBasicMaterial({
                color: 0x0000ff,
                wireframe: true,
                side:THREE.DoubleSide//两面可见
            }); //材质对象
            this.mesh = new THREE.Mesh(this.geometry, material); //网格模型对象Mesh
            this.mesh.position.set(100,0,-100);// 设置mesh2模型对象的xyz坐标为120,0,0
            this.scene.add(this.mesh); // 网格模型添加到场景中

            var shape = new THREE.Shape();//创建Shape对象

            // shape.arc(0, 0, 100, 0, 2 * Math.PI);
            // // 内轮廓1
            // var path1 = new THREE.Path();
            // path1.arc(0, 0, 40, 0, 2 * Math.PI);
            // // 内轮廓2
            // var path2 = new THREE.Path();
            // path2.arc(0, 80, 10, 0, 2 * Math.PI);
            // // 内轮廓3
            // var path3 = new THREE.Path();
            // path3.arc(-80, 0, 10, 0, 2 * Math.PI);
            // //三个内轮廓分别插入到holes属性中
            // shape.holes.push(path1, path2, path3);
            shape.moveTo(0,0);//起点
            shape.lineTo(0,10);//第2点
            shape.lineTo(10,10);//第3点
            shape.lineTo(10,0);//第4点
            shape.lineTo(0,0);//第5点
            var curve = new THREE.SplineCurve3([
                new THREE.Vector3( -100, -5, -50 ),
                new THREE.Vector3( 100, 0, 0 ),
                new THREE.Vector3( 80, 50, 50 ),
                new THREE.Vector3( -50, 0, 100)
            ]);

            var geometry = new THREE.ExtrudeGeometry(shape, {
                amount :120, // 拉伸长度
                extrudePath: curve, // 选择扫描轨迹
                bevelEnabled: false, // 无倒角
                steps:100
            });
            this.mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
            this.scene.add(this.mesh); // 网格模型添加到场景中

            // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
            let axisHelper = new THREE.AxisHelper(1000);
            this.scene.add(axisHelper);

            // 相机设置
            let width = 800; // 窗口宽度
            let height = 600; // 窗口高度
            let k = width / height; // 窗口宽高比
            let s = 200; // 三位场景显示范围控制系数，系数越大，显示的范围越大
            // 创建相机对象
            this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
            this.camera.position.set(100, 100, 100); //设置相机位置
            this.camera.lookAt(this.scene.position); //设置相机方向（指向的场景反向）

            // 创建渲染器对象
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(width, height); // 设置渲染器区域尺寸
            this.renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
            document.getElementById("box3").appendChild(this.renderer.domElement); //插入canvas对象
            // 执行渲染操作 指定场景、相机作为参数
            this.render = ()=> {
                this.renderer.render(this.scene,this.camera);//执行渲染操作
            };
            this.render();
            // 控制器
            this.controls = new OrbitControls(this.camera,this.renderer.domElement);//创建控件对象
            this.controls.addEventListener("change", this.render);//监听鼠标、键盘事件
        }
    }
};
</script>

<style lang='scss' scoped>
.box{
  height: 300px;
}
</style>