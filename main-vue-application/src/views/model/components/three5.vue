<template>
    <div>
        <div id='box5' class='box'></div>
    </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

export default {
    name: "Three5",
    data() {
        return {
            scene: {},
            geometry: {},
            camera: {},
            mesh: {},
            renderer: {},
            render: {},
            controls: {},
            state: {
                animateBones: true,
                wireframe: false
            }
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
            this.gui = new GUI();
            this.stats = new Stats();
            // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
            let axisHelper = new THREE.AxesHelper(160);
            this.scene.add(axisHelper);
            // ground
            let material = new THREE.MeshPhongMaterial({
                color: 0x999999,
                depthWrite: false
            });
            this.mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(200, 200), material);
            this.mesh.name = "ground";
            this.mesh.rotation.x = -Math.PI / 2;
            this.scene.add(this.mesh);

            // 网格
            this.grid = new THREE.GridHelper(200, 40, 0xff0000, 0x000000);
            this.grid.name = "GridHelper";
            this.grid.material.opacity = 0.2;
            this.grid.material.transparent = true;
            this.scene.add(this.grid);
            // 相机设置
            let w = 1200; // 窗口宽度
            let h = 800; // 窗口高度
            // let k = w / h; // 窗口宽高比
            // let s = 200; // 三位场景显示范围控制系数，系数越大，显示的范围越大
            // 创建相机对象
            // this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 10000);
            this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000 );

            this.camera.position.set(100, 100, 100); //设置相机位置
            this.camera.lookAt(this.scene.position); //设置相机方向（指向的场景反向）

            // 创建光源
            let ambient = new THREE.HemisphereLight(0xffffff, 0x444444);
            ambient.position.set( 0, 20, 0 );
            this.scene.add(ambient);
            let light = new THREE.DirectionalLight(0xffffff);
            light.position.set( 0, 20, 10);
            this.scene.add(light);

            // 创建渲染器对象
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(w, h); // 设置渲染器区域尺寸
            this.renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
            document.getElementById("box5").appendChild(this.renderer.domElement); //插入canvas对象
            // 执行渲染操作 指定场景、相机作为参数
            this.render = ()=> {
                this.renderer.render(this.scene,this.camera);//执行渲染操作
            };

            // this.guge();
            this.initBones();
            this.controlsEvent();

        },
        // 绑定骨骼
        initBones() {
            let segmentHeight = 8;
            let segmentCount = 4;
            let height = segmentHeight * segmentCount;
            let halfHeight = height * 0.5;
            let sizing = {
                segmentHeight: segmentHeight,
                segmentCount: segmentCount,
                height: height,
                halfHeight: halfHeight
            };
            let bonesSizing = {
                topWidth: 5,
                bottomWidth: 5,
            };
            this.geometry = this.createGeometry( sizing, bonesSizing );
            this.bones = this.createBones( sizing );
            this.mesh = this.createMesh( this.geometry, this.bones );
            this.mesh.position.set(20, 16, 0);
            this.mesh.rotation.z = Math.PI;
            // this.mesh.scale.multiplyScalar( 1 );
            this.scene.add( this.mesh );
            this.stats = new Stats();
            document.getElementById("box5").appendChild(this.stats.dom);
            // this.setupDatGui();
            let render=()=> {
                requestAnimationFrame( render );
                let time = Date.now() * 0.001;
                //Wiggle the bones
                if ( this.state.animateBones ) {
                    for ( let i = 0; i < this.mesh.skeleton.bones.length; i ++ ) {
                        this.mesh.skeleton.bones[ i ].rotation.z = Math.sin( time ) * 2 / this.mesh.skeleton.bones.length;
                    }
                }
                this.render();
                this.stats.update();
            };
            render();
        },
        // 创建骨骼
        createBones(sizing ) {
            let bones = [];
            let prevBone = new THREE.Bone();
            // 向上偏移高度一半
            prevBone.position.y = - sizing.halfHeight;
            bones.push( prevBone );
            for ( let i = 0; i < sizing.segmentCount; i ++ ) {
                // 创建一个骨骼
                let bone = new THREE.Bone();
                // 向上偏移一个高度
                bone.position.y = sizing.segmentHeight;
                // 创建的新骨骼添加到谷歌列表里，然后添加到mesh里
                bones.push( bone );
                // 创建骨骼父子关系
                prevBone.add( bone );
                // 将当前骨骼设置为下一个骨骼的父节点
                prevBone = bone;
            }
            return bones;
        },
        // 创建几何
        createGeometry( sizing, bonesSizing ) {
            // 创建一个圆柱体
            let geometry = new THREE.CylinderBufferGeometry( bonesSizing.topWidth, bonesSizing.bottomWidth,
                sizing.height, 50, sizing.segmentCount * 6, true );
            // 获取到几何体的位置属性
            let position = geometry.attributes.position;
            let vertex = new THREE.Vector3();
            let skinIndices = []; // 蒙皮索引数组
            let skinWeights = []; // 蒙皮权值
            for ( let i = 0; i < position.count; i ++ ) {
                // 给三维设置位置
                vertex.fromBufferAttribute( position, i );
                let y = vertex.y + sizing.halfHeight;
                // 每一个索引值向下取整
                let skinIndex = Math.floor( y / sizing.segmentHeight );
                let skinWeight = y % sizing.segmentHeight / sizing.segmentHeight;
                skinIndices.push( skinIndex, skinIndex + 1, 0, 0 );
                skinWeights.push( 1 - skinWeight, skinWeight, 0, 0 );
            }
            // 设置索引值
            geometry.setAttribute( "skinIndex", new THREE.Uint16BufferAttribute( skinIndices, 4 ) );
            // 设置权重
            geometry.setAttribute( "skinWeight", new THREE.Float32BufferAttribute( skinWeights, 4 ) );
            return geometry;
        },
        // 创建网格
        createMesh( geometry, bones ) {
            // 创建网格材质
            let material = new THREE.MeshPhongMaterial( {
                skinning: true,
                color: 0x156289,
                emissive: 0x072534,
                side: THREE.DoubleSide,
                flatShading: true
            } );
            // 创建网格
            let mesh = new THREE.SkinnedMesh( geometry,	material );
            // 创建骨架
            let skeleton = new THREE.Skeleton( bones );
            mesh.add( bones[ 0 ] ); // 绑定骨骼第一个
            mesh.bind( skeleton ); // 绑定骨架
            // 创建骨架辅助对象
            let skeletonHelper = new THREE.SkeletonHelper( mesh );
            skeletonHelper.material.linewidth = 2;
            this.scene.add( skeletonHelper );
            return mesh;
        },
        setupDatGui() {
            let folder = this.gui.addFolder( "General Options" );
            folder.add( this.state, "animateBones" );
            folder.__controllers[ 0 ].name( "Animate Bones" );
            folder.add( this.mesh, "pose" );
            folder.__controllers[ 1 ].name( ".pose()" );
            folder.add( this.state, "wireframe" ).onChange( ( e ) => {
                this.mesh.material.wireframe = e;
            } );

            let bones = this.mesh.skeleton.bones;
            for ( let i = 0; i < bones.length; i ++ ) {
                let bone = bones[ i ];
                folder = this.gui.addFolder( "Bone " + i );

                folder.add( bone.position, "x", - 10 + bone.position.x, 10 + bone.position.x );
                folder.add( bone.position, "y", - 10 + bone.position.y, 10 + bone.position.y );
                folder.add( bone.position, "z", - 10 + bone.position.z, 10 + bone.position.z );

                folder.add( bone.rotation, "x", - Math.PI * 0.5, Math.PI * 0.5 );
                folder.add( bone.rotation, "y", - Math.PI * 0.5, Math.PI * 0.5 );
                folder.add( bone.rotation, "z", - Math.PI * 0.5, Math.PI * 0.5 );

                folder.add( bone.scale, "x", 0, 2 );
                folder.add( bone.scale, "y", 0, 2 );
                folder.add( bone.scale, "z", 0, 2 );

                folder.__controllers[ 0 ].name( "position.x" );
                folder.__controllers[ 1 ].name( "position.y" );
                folder.__controllers[ 2 ].name( "position.z" );

                folder.__controllers[ 3 ].name( "rotation.x" );
                folder.__controllers[ 4 ].name( "rotation.y" );
                folder.__controllers[ 5 ].name( "rotation.z" );

                folder.__controllers[ 6 ].name( "scale.x" );
                folder.__controllers[ 7 ].name( "scale.y" );
                folder.__controllers[ 8 ].name( "scale.z" );

            }
        },
        jiya() {
            /**
       * 创建网格模型，并给模型的几何体设置多个变形目标
       */
            // 创建一个几何体具有8个顶点
            var geometry = new THREE.BoxGeometry(50, 50, 50); //立方体几何对象
            console.log(geometry.vertices);
            // 为geometry提供变形目标的数据
            var box1 = new THREE.BoxGeometry(100, 5, 100); //为变形目标1提供数据
            var box2 = new THREE.BoxGeometry(5, 200, 5); //为变形目标2提供数据
            // 设置变形目标的数据
            geometry.morphTargets[0] = {name: "target1",vertices: box1.vertices};
            geometry.morphTargets[1] = {name: "target2",vertices: box2.vertices};
            var material = new THREE.MeshLambertMaterial({
                morphTargets: true, //允许变形
                color: 0x0000ff
            }); //材质对象
            var mesh = new THREE.Mesh(geometry, material); //网格模型对象
            this.scene.add(mesh); //网格模型添加到场景中
            this.render();
        },
        controlsEvent() {
            // 控制器
            this.controls = new OrbitControls(this.camera,this.renderer.domElement);//创建控件对象
            this.controls.addEventListener("change", this.render);//监听鼠标、键盘事件
        },
    }
};
</script>

<style lang='scss' scoped>
.box{
  height: 500px;
  margin-bottom: 300px;
}
</style>