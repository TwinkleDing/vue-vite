<template>
  <div id="model" style="height: 100%; width: 100%">
    <Renderer
      ref="rendererC"
      antialias
      :orbit-ctrl="{ enableDamping: true }"
      :shadow="true"
      :resize="true"
      :pointer="true"
    >
      <Camera
        ref="cameraC"
        :fov="45"
        :aspect="width / height"
        :near="0.1"
        :far="40"
        :position="{ x: 1, y: 3, z: -3 }"
        :lookAt="{ x: 0, y: 1, z: 0 }"
      />
      <Scene ref="sceneC" background="#a0a0a0"> </Scene>
    </Renderer>
    <div class="ctrl">
      <el-button type="primary" @click="frame">帧动</el-button>
      <el-button type="primary" @click="pause">暂停/继续</el-button>
      <el-button
        v-for="(item, index) in actionsName"
        type="primary"
        @click="activeAction(index)"
      >
        {{ item }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted, watch, reactive } from "vue";
import {
  Renderer,
  RendererPublicInterface,
  Camera,
  Scene,
  DirectionalLight,
  HemisphereLight,
  Box,
  GltfModel,
} from "troisjs";
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const props = defineProps({
  height: {
    type: Number,
    default: 0,
  },
  width: {
    type: Number,
    default: 0,
  },
});
const ONE_STEP: Number = 0.05;
const rendererC = ref();
const sceneC = ref();
const cameraC = ref();
let actions: AnimationClip = reactive([]);
let actionsName: String = reactive([]);
let current = ref<Number>(0);
let sizeOfNextStep = ref<Number>(0);
let singleStepMode = ref<Boolean>(false);
let renderer;
let scene;
let camera;
let stats;
let mixer;
let clock;
watch(
  () => props,
  (e) => {
    renderer && renderer.three.setSize(e.width, e.height);
  },
  {
    immediate: true,
    deep: true,
  }
);

const init: void = () => {
  renderer = rendererC.value as RendererPublicInterface;
  scene = sceneC.value.scene;
  camera = cameraC.value.camera;
  camera.lookAt(0, 1, 0);
  clock = new THREE.Clock();

  renderer.three.setSize(props.width, props.height);
  // 创建坐标系
  let axisHelper = new THREE.AxesHelper(10);
  scene.add(axisHelper);
  // scene.position.x = 0.2;
  // scene.position.y = -0.5;
  scene.background = new THREE.Color(0xa0a0a0);
  scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);
  // 添加半球光
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);
  // 添加平行光
  const dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(-3, 10, -10);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 2;
  dirLight.shadow.camera.bottom = -2;
  dirLight.shadow.camera.left = -2;
  dirLight.shadow.camera.right = 2;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 40;
  scene.add(dirLight);
  scene.add(new THREE.CameraHelper(dirLight.shadow.camera));
  // 添加地面网格材料
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);
  addModel();

  stats = new Stats();
  stats.dom.style.position = "absolute";
  document.getElementById("model").appendChild(stats.dom);
};

const addModel: void = () => {
  const loader = new GLTFLoader();
  loader.load("../../models/Soldier.glb", function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    // 显示每个部件的影子
    model.traverse(function (object) {
      if (object.isMesh) object.castShadow = true;
    });
    //显示骨骼
    const skeleton = new THREE.SkeletonHelper(model);
    scene.add(skeleton);

    mixer = new THREE.AnimationMixer(model);
    gltf.animations.map((item: AnimationClip) => {
      actions.push(mixer.clipAction(item));
      actionsName.push(item.name);
    });
    activeAction(0);
    animate();
  });
};

const activeAction = (index: number) => {
  current.value = index;
  actions.forEach((item: AnimationClip, i: number) => {
    if (index === i) {
      setWeight(actions[index], 1);
      actions[index].play();
    } else {
      setWeight(item, 0);
    }
  });
};

const pause: void = () => {
  // 如果是帧动状态，先解除帧动状态
  if (singleStepMode.value) {
    singleStepMode.value = false;
  } else {
    actions[current.value].paused = !actions[current.value].paused;
  }
};

const frame: void = () => {
  // 如果是动画状态的暂停，先解除
  actions[current.value].paused = false;
  // 开启单步状态，并设置每次单步的间隔
  singleStepMode.value = true;
  sizeOfNextStep.value = ONE_STEP;
};

const setWeight = (action: AnimationClip, weight: number) => {
  action.enabled = true;
  action.setEffectiveTimeScale(1);
  action.setEffectiveWeight(weight);
};

const animate: void = () => {
  requestAnimationFrame(animate);
  let mixerUpdateDelta = clock.getDelta();
  // 如果是帧动模式，开启单步状态
  if (singleStepMode.value) {
    mixerUpdateDelta = sizeOfNextStep.value;
    sizeOfNextStep.value = 0;
  }
  mixer.update(mixerUpdateDelta);
  stats.update();
};

const addCtrl: void = () => {
  const orbitCtrl = renderer.three.cameraCtrl;
  orbitCtrl.addEventListener("change", () => {
    // console.log(1);
  });
};

onMounted(() => {
  init();
  addCtrl();
});
</script>

<style scoped lang="scss">
#model {
  position: relative;
  .ctrl {
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
</style>
