<template>
    <div>
        <div id='box4' class='box'></div>
    </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default {
    name: "Three4",
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

            // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
            let axisHelper = new THREE.AxisHelper(1000);
            this.scene.add(axisHelper);

            // 相机设置
            let width = 800; // 窗口宽度
            let height = 600; // 窗口高度
            let k = width / height; // 窗口宽高比
            let s = 200; // 三位场景显示范围控制系数，系数越大，显示的范围越大
            // 创建相机对象
            this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 10000);
            this.camera.position.set(100, 100, 100); //设置相机位置
            this.camera.lookAt(this.scene.position); //设置相机方向（指向的场景反向）

            // 光源设置
            // 点光源
            let point = new THREE.PointLight(0xffffff);
            point.position.set(100, 200, 200); // 点光源位置   z←y↑x→
            this.scene.add(point); // 点光源添加到场景中
            // 环境光
            let ambient = new THREE.AmbientLight(0x444444);
            this.scene.add(ambient); // 设置环境光

            // 创建渲染器对象
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(width, height); // 设置渲染器区域尺寸
            this.renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
            document.getElementById("box4").appendChild(this.renderer.domElement); //插入canvas对象
            // 执行渲染操作 指定场景、相机作为参数
            this.render = ()=> {
                this.renderer.render(this.scene,this.camera);//执行渲染操作
            };
            this.controlsEvent();

            let TextureLoader = new THREE.TextureLoader();
            TextureLoader.load("../static/earth.jpg", (texture)=> {
                let geometry = new THREE.PlaneGeometry(200, 118); // 矩形平面
                // this.geometry = new THREE.BoxGeometry(100, 100, 100); //立方体
                // this.geometry = new THREE.SphereGeometry(60, 25, 25); //球体

                // 阵列
                // texture.wrapS = THREE.RepeatWrapping;
                // texture.wrapT = THREE.RepeatWrapping;
                // texture.repeat.set(1, 2);

                // 偏移
                // texture.offset = new THREE.Vector2(0.3, 0.1);

                // 纹理旋转
                // texture.rotation = Math.PI/4;
                // 设置纹理的旋转中心，默认(0,0)
                // texture.center.set(0.5,0.5);


                let material = new THREE.MeshLambertMaterial({
                    map: texture, //设置纹理贴图
                    // let material = new THREE.MeshPhongMaterial({
                    //   normalMap: texture, //法线贴图
                    side: THREE.DoubleSide, //两面可见
                });
                let mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
                mesh.position.set(100, 100, 0);// 设置mesh2模型对象的xyz坐标为120,0,0
                // this.scene.add(mesh);
                // this.render();
            });
            this.other();
        },
        other() {
            // this.geometry = new THREE.BoxGeometry(100, 100, 100); //立方体
            // let geometry = new THREE.PlaneGeometry(204, 102, 4, 4); //矩形平面
            // let geometry = new THREE.SphereGeometry(60, 25, 25); //球体
            // let geometry = new THREE.CylinderGeometry(60, 60, 25,25); //圆柱
            /*
        this.geometry = new THREE.BoxGeometry(100, 100, 100); //立方体
        // 材质对象1
        // let material1 = new THREE.MeshPhongMaterial({
        //   color: 0xffff3f
        // });
        // let textureLoader = new THREE.TextureLoader(); // 纹理加载器
        // let texture = textureLoader.load('../static/earth.jpg'); // 加载图片，返回Texture对象
        // // 材质对象2
        // let material2 = new THREE.MeshLambertMaterial({
        //   map: texture, // 设置纹理贴图
        //   side: THREE.DoubleSide, //两面可见
        //   // wireframe:true,
        // });
        // // 设置材质数组
        // let materialArr = [material2, material1, material1, material1, material1, material1];
        // // 设置数组材质对象作为网格模型材质参数
        // this.mesh = new THREE.Mesh(this.geometry, materialArr); //网格模型对象Mesh
      */
            /*
      this.geometry = new THREE.BoxGeometry(100, 100, 100); //立方体
      let textureLoader = new THREE.TextureLoader();
      // 加载法线贴图
      let textureNormal = textureLoader.load('./static/13_256.jpg');
      let material = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        normalMap: textureNormal, //法线贴图
        //设置深浅程度，默认值(1,1)。
        normalScale: new THREE.Vector2(3, 3),
      }); //材质对象Material
      this.mesh = new THREE.Mesh(this.geometry, material); //网格模型对象Mesh
      */

            this.geometry = new THREE.SphereGeometry(100, 25, 25); //球体
            // TextureLoader创建一个纹理加载器对象，可以加载图片作为几何体纹理
            var textureLoader = new THREE.TextureLoader();
            // 加载纹理贴图
            var texture = textureLoader.load("./static/earth.jpg");
            // 加载法线贴图
            var textureNormal = textureLoader.load("./static/EarthNormal.jpg");
            var material = new THREE.MeshPhongMaterial({
                map: texture, // 普通颜色纹理贴图
                normalMap: textureNormal, //法线贴图
                //设置深浅程度，默认值(1,1)。
                normalScale: new THREE.Vector2(1.2, 1.2),
            }); //材质对象Material
            this.mesh = new THREE.Mesh(this.geometry, material); //网格模型对象Mesh

            this.scene.add(this.mesh); //网格模型添加到场景中
            this.render();
            this.animation();
        },
        controlsEvent() {
            // 控制器
            this.controls = new OrbitControls(this.camera,this.renderer.domElement);//创建控件对象
            this.controls.addEventListener("change", this.render);//监听鼠标、键盘事件
        },
        animation() {
            /*
        注意网格模型Mesh进行缩放旋转平移变换和几何体Geometry可以实现相同的渲染效果，
        但是网格模型Mesh进行这些变换不会影响几何体的顶点位置坐标，
        网格模型缩放旋转平移变换改变的是模型的本地矩阵、世界矩阵。
      */
            // .scale()、.translate()、.rotateX()等方法可以对几何体本身进行缩放、平移、旋转
            this.render();
            // this.mesh.rotateX(0.01);//每次绕y轴旋转0.01弧度
            // this.mesh.rotateY(0.01);//每次绕y轴旋转0.01弧度
            // this.mesh.rotateX(0.01);//每次绕y轴旋转0.01弧度
            this.mesh.rotateY(0.01);//每次绕y轴旋转0.01弧度
            // this.mesh.rotateZ(0.01);//每次绕y轴旋转0.01弧度
            requestAnimationFrame(this.animation);//请求再次执行渲染函数render
        },
    }
};
</script>

<style lang='scss' scoped>
.box{
  height: 300px;
}
</style>