<template>
    <div>
        <div id='box2' class='box'></div>
        <el-button @click='setD'>点模型</el-button>
        <el-button @click='setM'>面模型</el-button>
    </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default {
    name: "Three2",
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
            // 创建网格模型
            this.geometry = new THREE.BufferGeometry(); //创建一个Buffer类型几何体对象
            //类型数组创建顶点数据
            var vertices = new Float32Array([
                0, 0, 0, //顶点1坐标
                50, 0, 0, //顶点2坐标
                0, 100, 0, //顶点3坐标
                0, 0, 10, //顶点4坐标
                0, 0, 100, //顶点5坐标
                50, 0, 10, //顶点6坐标
            ]);
            // 创建属性缓冲区对象
            var attribue = new THREE.BufferAttribute(vertices, 3); //3个为一组，表示一个顶点的xyz坐标
            // 设置几何体attributes属性的位置属性
            this.geometry.attributes.position = attribue;

            //类型数组创建顶点颜色color数据
            let colors = new Float32Array([
                1, 0, 0, //顶点1颜色
                0, 1, 0, //顶点2颜色
                0, 0, 1, //顶点3颜色

                1, 1, 0, //顶点4颜色
                0, 1, 1, //顶点5颜色
                1, 0, 1, //顶点6颜色
            ]);
            this.geometry.attributes.color = new THREE.BufferAttribute(colors, 3);
            let material = new THREE.PointsMaterial({
                vertexColors: THREE.VertexColors, //以顶点颜色为准
                side: THREE.DoubleSide, //两面可见
                size: 10.0 //点对象像素尺寸
            }); //材质对象
            this.mesh = new THREE.Mesh(this.geometry, material); //网格模型对象Mesh
            this.scene.add(this.mesh); // 网格模型添加到场景中

            // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
            let axisHelper = new THREE.AxisHelper(250);
            this.scene.add(axisHelper);

            // 相机设置
            let width = 400; // 窗口宽度
            let height = 300; // 窗口高度
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
            document.getElementById("box2").appendChild(this.renderer.domElement); //插入canvas对象
            // 执行渲染操作 指定场景、相机作为参数
            // this.renderer.render(this.scene, this.camera);
            this.render = ()=> {
                this.renderer.render(this.scene,this.camera);//执行渲染操作
            };
            this.render();
            this.controls = new OrbitControls(this.camera,this.renderer.domElement);//创建控件对象
            this.controls.addEventListener("change", this.render);//监听鼠标、键盘事件
        },
        setD() {
            //类型数组创建顶点颜色color数据
            let colors = new Float32Array([
                1, 0, 0, //顶点1颜色
                0, 1, 0, //顶点2颜色
                0, 0, 1, //顶点3颜色

                1, 1, 0, //顶点4颜色
                0, 1, 1, //顶点5颜色
                1, 0, 1, //顶点6颜色
            ]);
            this.geometry.attributes.color = new THREE.BufferAttribute(colors, 3);
            let material = new THREE.PointsMaterial({
                vertexColors: THREE.VertexColors, //以顶点颜色为准
                size: 10.0 //点对象像素尺寸
            }); //材质对象
            let points = new THREE.Points(this.geometry, material); //点模型对象
            this.scene.add(points); //点对象添加到场景中
            this.render();
        },
        setM() {
            //类型数组创建顶点颜色color数据
            let colors = new Float32Array([
                1, 0, 0, //顶点1颜色
                0, 1, 0, //顶点2颜色
                0, 0, 1, //顶点3颜色

                1, 1, 0, //顶点4颜色
                0, 1, 1, //顶点5颜色
                1, 0, 1, //顶点6颜色
            ]);
            this.geometry.attributes.color = new THREE.BufferAttribute(colors, 3);
            let material=new THREE.LineBasicMaterial({
                vertexColors: THREE.VertexColors, //以顶点颜色为准
            });//材质对象
            let line = new THREE.Line(this.geometry,material);//线条模型对象
            this.scene.add(line);//线条对象添加到场景中
            this.render();
        }
    }
};
</script>

<style lang='scss' scoped>
.box{
  height: 300px;
}
</style>