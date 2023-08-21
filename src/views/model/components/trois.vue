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
        :near="1"
        :far="1000"
        :position="{ x: 1, y: 3, z: -3 }"
      />
      <Scene ref="sceneC" />
    </Renderer>
    <div class="ctrl">
      <div>
        <el-switch
          v-model="allActions"
          inline-prompt
          style="--el-switch-off-color: var(--systemThemeColorActive)"
          active-text="启动所有动作"
          inactive-text="禁用所有动作"
          @change="offAllActions"
        />
      </div>
      <div>
        动作：时段：{{ timeScale }}
        <el-slider
          v-model="timeScale"
          :min="0"
          :max="2"
          @input="timeScaleChange"
          :step="0.01"
        />
      </div>
      <div class="btns">
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
      <div>
        <div>
          动态：转换时长：{{ fadeDuration }}
          <el-slider
            v-model="fadeDuration"
            :min="0"
            :max="10"
            :step="0.01"
            @change="fadeDurationChange"
          />
        </div>
        <div class="btns">
          <el-button
            :disabled="current !== 0"
            type="primary"
            @click="setFade(IDLE_TO_WALK)"
          >
            从停到走
          </el-button>
          <el-button
            :disabled="current !== 3"
            type="primary"
            @click="setFade(WALK_TO_RUN)"
          >
            从走到跑
          </el-button>
          <el-button
            :disabled="current !== 1"
            type="primary"
            @click="setFade(RUN_TOP_WALK)"
          >
            从跑到走
          </el-button>
          <el-button
            :disabled="current !== 3"
            type="primary"
            @click="setFade(WALK_TO_IDLE)"
          >
            从走到停
          </el-button>
        </div>
        <div>
          <div>
            idleWeight:
            <el-progress :percentage="idleWeight * 100" :stroke-width="15" striped />
          </div>
          <div>
            walkWeight:
            <el-progress :percentage="walkWeight * 100" :stroke-width="15" striped />
          </div>
          <div>
            runWeight:
            <el-progress :percentage="runWeight * 100" :stroke-width="15" striped />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted, watch, reactive } from "vue";
import { Renderer, RendererPublicInterface, Camera, Scene } from "troisjs";
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import Trois from "./Trois";

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
const IDLE_TO_WALK: string = "IDLE_TO_WALK";
const WALK_TO_RUN: string = "WALK_TO_RUN";
const RUN_TOP_WALK: string = "RUN_TOP_WALK";
const WALK_TO_IDLE: string = "WALK_TO_IDLE";
const rendererC = ref();
const sceneC = ref();
const cameraC = ref();
const current = ref<number>(0);
const timeScale = ref<number>(1);
const idleWeight = ref<number>(0);
const walkWeight = ref<number>(0);
const runWeight = ref<number>(0);
const fadeDuration = ref<number>(3);
const allActions = ref<boolean>(true);
let actionsName: string[] = reactive([]);
let dirLight;

let renderer: any;
let scene: any;
let camera;
let stats;
let trois: Trois;
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

const init = (): void => {
  renderer = rendererC.value as RendererPublicInterface;
  scene = sceneC.value.scene;
  camera = cameraC.value.camera;

  renderer.three.setSize(props.width, props.height);
  renderer.three.renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.three.renderer.antialias = true;

  // 创建坐标系
  let axisHelper = new THREE.AxesHelper(10);
  scene.add(axisHelper);
  scene.background = new THREE.Color(0xa0a0a0);
  // scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);
  // 添加半球光
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);
  // 添加平行光
  dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(-3, 3, -3);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 2;
  dirLight.shadow.camera.bottom = -1;
  dirLight.shadow.camera.left = -1;
  dirLight.shadow.camera.right = 1;
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
  stats = new Stats();
  stats.dom.style.position = "absolute";
  document.getElementById("model")?.appendChild(stats.dom);
  addModel();
  // 设置灯光自旋
  setLightSpin(dirLight.position);
  addSphere();
};

const setLightSpin = (position: any): void => {
  const clock = new THREE.Clock();
  let timer = 0;

  const rotate = () => {
    requestAnimationFrame(rotate);
    const delta = clock.getDelta();
    timer += delta / 5;
    const x = -3 * Math.cos(timer);
    const z = -3 * Math.sin(timer);
    position.set(x, 3, z);
  };
  rotate();
};

const addModel = async (): Promise<void> => {
  trois = new Trois();
  const model: any = await trois.initModel();
  scene.add(model);
  //显示骨骼
  const skeleton = new THREE.SkeletonHelper(model);
  scene.add(skeleton);
  // 获取动画列表
  const actionList = trois.getActionList();
  actionList.map((item: THREE.AnimationClip): void => {
    actionsName.push(item.getClip().name);
  });
  // 获取weight值
  trois.troisChange((e: Trois): void => {
    idleWeight.value = e.getIdleWeight();
    walkWeight.value = e.getWalkWeight();
    runWeight.value = e.getRunWeight();
  });

  modelDIY(model);
};

// 启用或禁用所有动作
const offAllActions = (): void => {
  if (allActions.value) {
    trois.activateAllActions();
  } else {
    trois.deactivateAllActions();
  }
};
const timeScaleChange = (timeScale: number): void => trois.timeScaleChange(timeScale);
// 暂停/继续
const pause = (): void => trois.pause();
// 帧动
const frame = (): void => trois.frame();
// 修改动作
const activeAction = (index: number): void => {
  trois.activeAction(index);
};
const fadeDurationChange = (fadeDuration: number) => trois.setFadeDuration(fadeDuration);
const setFade = (type: string): void => {
  trois.setFade(type);
  current.value = trois.getCurrent();
};
const addCtrl = (): void => {
  const orbitCtrl = renderer.three.cameraCtrl;
  orbitCtrl.addEventListener("change", () => {
    // console.log(1);
  });
};

const modelDIY = (model: THREE.Group): void => {
  const bone = model.children[0].children[0]; // 骨骼
  const body = model.children[0].children[1]; // 身体
  const face = model.children[0].children[2]; // 面部
};

const addSphere = (): void => {};

onMounted((): void => {
  init();
  // addCtrl();
});
</script>

<style scoped lang="scss">
@import "@/css/theme.scss";
#model {
  position: relative;
  .ctrl {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 200px;
    padding: 10px 20px;
    border: 1px solid $--color-minor;
    border-radius: 16px;
    // background: $--color-minor;
    .btns {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      button {
        width: 40%;
        margin: 5px !important;
      }
    }
  }
}
</style>
