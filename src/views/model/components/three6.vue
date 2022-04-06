<template>
    <div class="three6">
        <div id='box5' class='box'></div>
        <div id='status'></div>
    </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

export default {
    name: "Three6",
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
                animateBonesZ: false,
                animateBonesT: false,
                animateBonesN: false,
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

            this.initBones();
            this.controlsEvent();

        },
        // 绑定骨骼
        initBones() {
            let segmentHeight = 16;
            let segmentCount = 2;
            let height = segmentHeight * 2;
            let halfHeight = height * 0.5;
            let sizing = {
                segmentHeight: segmentHeight,
                segmentCount: segmentCount,
                height: height,
                halfHeight: halfHeight
            };
            this.bones = this.createBones( sizing );
            this.mesh = this.createMesh( this.bones );
            this.mesh.position.set(20, 16, 0);
            this.mesh.rotation.z = Math.PI;
            // this.mesh.scale.multiplyScalar( 1 );
            this.scene.add( this.mesh );
            this.stats = new Stats();
            document.getElementById("status").appendChild(this.stats.dom);
            this.setupDatGui();
            this.timeGo= Math.PI / 2;
            let render=()=> {
                requestAnimationFrame( render );
                this.timeGo += 0.1;
                //Wiggle the bones
                this.renderRun();
                this.render();
                this.stats.update();
            };
            render();
        },
        renderRun() {
            if ( this.state.animateBonesZ ) {
                this.run1();
            }
            if ( this.state.animateBonesT ) {
                this.run2();
            }
            if ( this.state.animateBonesN ) {
                this.reRun();
            }
        },
        run1() {
            this.reRun();
            // 前后
            this.mesh.children[2].skeleton.bones[1].rotation.z = Math.sin( this.timeGo ) * 2 / this.mesh.children[0].skeleton.bones.length;
            this.mesh.children[4].skeleton.bones[1].rotation.z = - Math.sin( this.timeGo ) * 2 / this.mesh.children[0].skeleton.bones.length;
            this.mesh.children[6].skeleton.bones[1].rotation.z = - Math.sin( this.timeGo ) * 2 / this.mesh.children[0].skeleton.bones.length;
            this.mesh.children[8].skeleton.bones[1].rotation.z = Math.sin( this.timeGo ) * 2 / this.mesh.children[0].skeleton.bones.length;
        },
        run2() {
            this.reRun();
            // 左右
            this.mesh.children[2].skeleton.bones[1].rotation.x = Math.sin( this.timeGo ) / this.mesh.children[0].skeleton.bones.length;
            this.mesh.children[4].skeleton.bones[1].rotation.x = - Math.sin( this.timeGo ) / this.mesh.children[0].skeleton.bones.length;
            this.mesh.children[6].skeleton.bones[1].rotation.x = Math.sin( this.timeGo ) / this.mesh.children[0].skeleton.bones.length;
            this.mesh.children[8].skeleton.bones[1].rotation.x = - Math.sin( this.timeGo ) / this.mesh.children[0].skeleton.bones.length;
        },
        // 归位
        reRun() {
            this.mesh.children[2].skeleton.bones[1].rotation.z = 0;
            this.mesh.children[4].skeleton.bones[1].rotation.z = 0;
            this.mesh.children[6].skeleton.bones[1].rotation.z = 0;
            this.mesh.children[8].skeleton.bones[1].rotation.z = 0;
            this.mesh.children[2].skeleton.bones[1].rotation.x = 0;
            this.mesh.children[4].skeleton.bones[1].rotation.x = 0;
            this.mesh.children[6].skeleton.bones[1].rotation.x = 0;
            this.mesh.children[8].skeleton.bones[1].rotation.x = 0;
        },
        // 创建骨骼
        createBones(sizing ) {
            let bones = [];
            let bone1 = new THREE.Bone();
            let bone2 = new THREE.Bone();
            let bone21 = new THREE.Bone();
            let bone3 = new THREE.Bone();
            let bone31 = new THREE.Bone();
            let bone311 = new THREE.Bone();
            let bone32 = new THREE.Bone();
            let bone321 = new THREE.Bone();
            let bone4 = new THREE.Bone();
            let bone41 = new THREE.Bone();
            let bone5 = new THREE.Bone();
            let bone51 = new THREE.Bone();

            bone1.position.y = - sizing.halfHeight;
            bone1.name="ren";
            //脖子往上
            bone1.add(bone2);
            bone2.name="bozi";
            bone2.position.y = - sizing.height / 4;
            bone2.add(bone21);
            bone21.name="tou";
            bone21.position.y = - sizing.height / 4;
            // 躯干
            bone1.add(bone3);
            bone3.name="qugan";
            bone3.position.y = sizing.height;
            // 左臂
            bone1.add(bone4);
            bone4.name="zuodabi";
            bone4.position.z = - sizing.segmentHeight;
            bone4.add(bone41);
            bone41.name="zuoxiaobi";
            bone41.position.y = sizing.segmentHeight;
            // 右臂
            bone1.add(bone5);
            bone5.name="youdabi";
            bone5.position.z = sizing.segmentHeight;
            bone5.add(bone51);
            bone51.name="youxiaobi";
            bone51.position.y = sizing.segmentHeight;
            // 左腿
            bone3.add(bone31);
            bone31.name="zuodatui";
            bone31.position.z = - sizing.segmentHeight;
            bone31.add(bone311);
            bone311.name="zuoxiaotui";
            bone311.position.y = sizing.segmentHeight;
            // 右腿
            bone3.add(bone32);
            bone32.name="youdatui";
            bone32.position.z = sizing.segmentHeight;
            bone32.add(bone321);
            bone321.name="youxiaotui";
            bone321.position.y = sizing.segmentHeight;
            bones = [bone1, bone2, bone3, bone31, bone311, bone32, bone321, bone4, bone41, bone5, bone51, bone21];
            return bones;
        },
        // 创建几何
        createGeometry( count, height, topWidth, bottomWidth, qiu ) {
            let geometry = {};
            if(qiu) {
                geometry = new THREE.BoxBufferGeometry(height, height, height);
            }else {
                // 创建一个圆柱体
                geometry = new THREE.CylinderBufferGeometry( bottomWidth, topWidth,
                    height, 100, count, true );
            }
            // 获取到几何体的位置属性
            let position = geometry.attributes.position;
            let vertex = new THREE.Vector3();
            let skinIndices = []; // 蒙皮索引数组
            let skinWeights = []; // 蒙皮权值
            for ( let i = 0; i < position.count; i ++ ) {
                // 给三维设置位置
                vertex.fromBufferAttribute( position, i );
                let y = vertex.y + height / 2;
                // 每一个索引值向下取整
                let skinIndex = Math.floor( y / (height / count) );
                let skinWeight = y % (height / count) / (height / count);
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
        createMesh( bones ) {
            // 创建网格材质
            let material = new THREE.MeshPhongMaterial( {
                skinning: true,
                color: 0x156289,
                side: THREE.DoubleSide,
                flatShading: true
            } );

            // 加载纹理贴图
            let textureLoader = new THREE.TextureLoader();
            let texture = textureLoader.load("./static/shidifu.jpg");
            let materialFace = new THREE.MeshPhongMaterial({
                skinning: true,
                map: texture,
                side: THREE.DoubleSide,
                normalScale: new THREE.Vector2(1.2, 1.2),
                transparent: true,
            });
            let materialArr = [materialFace, material, material, material, material, material];
            // 创建脖子
            let geometryBoZi = this.createGeometry( 1, 8, 3, 3);
            geometryBoZi.rotateZ(Math.PI);
            geometryBoZi.translate(0, -20, 0);
            let meshBoZi = new THREE.SkinnedMesh( geometryBoZi,	material );
            meshBoZi.name="脖子";
            let skeletonBoZi = new THREE.Skeleton( [bones[0], bones[1]] );
            meshBoZi.add( bones[ 0 ] ); // 绑定骨骼第一个
            meshBoZi.bind( skeletonBoZi );

            let geometryBoZi2 = this.createGeometry( 1, 16, 3, 3, "qiu" );
            geometryBoZi2.rotateZ(Math.PI);
            geometryBoZi2.translate(0, -32, 0);
            let meshBoZi2 = new THREE.SkinnedMesh( geometryBoZi2,	materialArr );
            meshBoZi2.name="头";
            let skeletonBoZi2 = new THREE.Skeleton( [bones[1], bones[11]] );
            meshBoZi2.bind( skeletonBoZi2 );

            // 创建躯干
            let geometryQuGan = this.createGeometry( 1, 32, 6, 6 );
            let meshQuGan = new THREE.SkinnedMesh( geometryQuGan,	material );
            meshQuGan.name="躯干";
            let skeletonQuGan = new THREE.Skeleton( [bones[0], bones[2]] );
            meshQuGan.add( bones[ 0 ] ); // 绑定骨骼第一个
            meshQuGan.bind( skeletonQuGan );

            // 创建左臂
            let geometryZuoBi = this.createGeometry( 1, 16, 3, 3 );
            geometryZuoBi.rotateX(- Math.PI / 2);
            geometryZuoBi.translate(0, -16, -8);
            let meshZuoBi = new THREE.SkinnedMesh( geometryZuoBi,	material );
            meshZuoBi.name="左臂";
            let skeletonZuoBi = new THREE.Skeleton( [bones[0], bones[7]] );
            meshZuoBi.bind( skeletonZuoBi );

            let geometryZuoBi2 = this.createGeometry( 1, 16, 3, 3 );
            geometryZuoBi2.translate(0, -8, -16);
            let meshZuoBi2 = new THREE.SkinnedMesh( geometryZuoBi2,	material );
            meshZuoBi2.name="左臂2";
            let skeletonZuoBi2 = new THREE.Skeleton( [bones[7], bones[8]] );
            meshZuoBi2.bind( skeletonZuoBi2 );

            // 创建右臂
            let geometryYouBi = this.createGeometry( 1, 16, 3, 3 );
            geometryYouBi.rotateX(Math.PI / 2);
            geometryYouBi.translate(0, -16, 8);
            let meshYouBi = new THREE.SkinnedMesh( geometryYouBi,	material );
            meshYouBi.name="右臂";
            let skeletonYouBi = new THREE.Skeleton( [bones[0], bones[9]] );
            meshYouBi.bind( skeletonYouBi );

            let geometryYouBi2 = this.createGeometry( 1, 16, 3, 3 );
            geometryYouBi2.translate(0, -8, 16);
            let meshYouBi2 = new THREE.SkinnedMesh( geometryYouBi2,	material );
            meshYouBi2.name="右臂2";
            let skeletonYouBi2 = new THREE.Skeleton( [bones[9], bones[10]] );
            meshYouBi2.bind( skeletonYouBi2 );

            // 创建左腿
            let geometryZuoTui = this.createGeometry( 1, 16, 3, 3 );
            geometryZuoTui.rotateX(- Math.PI / 2);
            geometryZuoTui.translate(0, 16, -8);
            let meshZuoTui = new THREE.SkinnedMesh( geometryZuoTui,	material );
            meshZuoTui.name="左腿";
            let skeletonZuoTui = new THREE.Skeleton( [bones[2], bones[3]] );
            meshZuoTui.bind( skeletonZuoTui );

            let geometryZuoTui2 = this.createGeometry( 1, 16, 3, 3 );
            geometryZuoTui2.translate(0, 24, -16);
            let meshZuoTui2 = new THREE.SkinnedMesh( geometryZuoTui2,	material );
            meshZuoTui2.name="左腿2";
            let skeletonZuoTui2 = new THREE.Skeleton( [bones[3], bones[4]] );
            meshZuoTui2.bind( skeletonZuoTui2 );

            // 创建右腿
            let geometryYouTui = this.createGeometry( 1, 16, 3, 3 );
            geometryYouTui.rotateX(Math.PI / 2);
            geometryYouTui.translate(0, 16, 8);
            let meshYouTui = new THREE.SkinnedMesh( geometryYouTui,	material );
            meshYouTui.name="右腿";
            let skeletonYouTui = new THREE.Skeleton( [bones[2], bones[5]] );

            meshYouTui.bind( skeletonYouTui );
            let geometryYouTui2 = this.createGeometry( 1, 16, 3, 3 );
            geometryYouTui2.translate(0, 24, 16);
            let meshYouTui2 = new THREE.SkinnedMesh( geometryYouTui2,	material );
            meshYouTui2.name="右腿2";
            let skeletonYouTui2 = new THREE.Skeleton( [bones[5], bones[6]] );
            meshYouTui2.bind( skeletonYouTui2 );


            let group = new THREE.Group();
            group.add(meshBoZi, meshQuGan, meshZuoBi, meshZuoBi2, meshYouBi, meshYouBi2, meshZuoTui, meshZuoTui2, meshYouTui, meshYouTui2, meshBoZi2);
            // 创建骨架辅助对象
            let skeletonHelper = new THREE.SkeletonHelper( group );
            skeletonHelper.material.linewidth = 2;
            this.scene.add( skeletonHelper );
            return group;
        },
        setupDatGui() {
            this.gui = new GUI();
            let folder = this.gui.addFolder( "General Options" );
            folder.add( this.state, "animateBonesZ" );
            folder.__controllers[ 0 ].name( "走路" );
            folder.add( this.state, "animateBonesT" );
            folder.__controllers[ 1 ].name( "跳跃" );
            folder.add( this.state, "animateBonesN" );
            folder.__controllers[ 2 ].name( "归位" );
            folder.add( this.state, "wireframe" ).onChange( ( e ) => {
                this.mesh.children[0].material.wireframe = e;
            } );
            // 脖子
            this.GUIInfo("脖子", 0);
            // 躯干
            this.GUIInfo("躯干", 1);
            // 左臂
            this.GUIInfo("左臂", 2);
            // 右臂
            this.GUIInfo("右臂", 4);
            // 左腿
            this.GUIInfo("左腿", 6);
            // 右腿
            this.GUIInfo("右腿", 8);
        },
        GUIInfo(parts, index) {
            let bonesBoZi = this.mesh.children[index].skeleton.bones;
            for ( let i = 0; i < bonesBoZi.length; i ++ ) {
                if(i === 0) {
                    continue;
                }
                let bone = bonesBoZi[ i ];
                let folder = this.gui.addFolder(parts+i);

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
        controlsEvent() {
            // 控制器
            this.controls = new OrbitControls(this.camera,this.renderer.domElement);//创建控件对象
            this.controls.addEventListener("change", this.render);//监听鼠标、键盘事件
        },
    },
    beforeDestroy() {
        document.getElementsByClassName("dg ac")[0].removeChild(document.getElementsByClassName("dg main a")[0]);
        this.gui = "";
    },
};
</script>

<style lang='scss'>
.three6{
  position: relative;
  .box{
    height: 500px;
    margin-bottom: 300px;
    position: relative;
  }
  #status{
    position: absolute;
    top: 0;
    div{
      position: absolute!important;
    }
  }
}
.dg.ac{
  position: absolute!important;
  top: 60px!important;
}

</style>