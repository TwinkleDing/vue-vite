<template>
  <div id="model" class="model-ca"></div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import * as THREE from "three";
import { FlyControls } from "three/examples/jsm/controls/FlyControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";
const props = defineProps({
  height: {
    type: Number,
    default: 765,
  },
  width: {
    type: Number,
    default: 1360,
  },
});
const SCREEN_HEIGHT: number = props.height;
const SCREEN_WIDTH: number = props.width;
const rotationSpeed: number = 0.02;
const cloudsScale: number = 1.005;
const radius: number = 6371;
const tilt: number = 0.41;
const renderer: any = new THREE.WebGLRenderer({ antialias: true }); // 抗锯齿
const textureLoader: any = new THREE.TextureLoader();
const clock: any = new THREE.Clock();
let meshClouds: any;
let meshPlanet: any;
let container: any;
let composer: any;
let camera: any;
let scene: any;

const init = (): void => {
  // 场景
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.00000025);

  // 相机
  camera = new THREE.PerspectiveCamera(25, SCREEN_WIDTH / SCREEN_HEIGHT, 50, 1e7);
  camera.position.z = radius * 7;

  // 光源
  const dirLight: any = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(1, 0, 1).normalize();
  scene.add(dirLight);

  const materialNormalMap: any = new THREE.MeshPhongMaterial({
    specular: 0x333333,
    shininess: 15,
    map: textureLoader.load("./static/planets/earth_atmos_2048.jpg"),
    specularMap: textureLoader.load("./static/planets/earth_specular_2048.jpg"),
    normalMap: textureLoader.load("./static/planets/earth_normal_2048.jpg"),
    normalScale: new THREE.Vector2(0.85, -0.85),
  });

  // 地球
  const geometry: any = new THREE.SphereGeometry(radius, 100, 50);
  meshPlanet = new THREE.Mesh(geometry, materialNormalMap);
  meshPlanet.rotation.y = 2.5;
  meshPlanet.rotation.z = tilt;
  scene.add(meshPlanet);

  // 云
  const materialClouds: any = new THREE.MeshLambertMaterial({
    map: textureLoader.load("./static/planets/earth_clouds_1024.png"),
    transparent: true,
  });
  meshClouds = new THREE.Mesh(geometry, materialClouds);
  meshClouds.scale.set(cloudsScale, cloudsScale, cloudsScale);
  meshClouds.rotation.y = 2.5;
  meshClouds.rotation.z = tilt;
  scene.add(meshClouds);

  // 星星
  stars();
  const renderModel: any = new RenderPass(scene, camera);
  const effectFilm: any = new FilmPass(0.35, 0.75, 2048, false);
  composer = new EffectComposer(renderer);
  composer.addPass(renderModel);
  composer.addPass(effectFilm);

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  container = document.getElementById("model");
  container.appendChild(renderer.domElement);
  window.addEventListener("resize", onWindowResize);
  onWindowResize();
  animate();
};
const stars = (): void => {
  const r = radius;
  const starsGeometry = [new THREE.BufferGeometry(), new THREE.BufferGeometry()];
  const vertices1: number[] = [];
  const vertices2: number[] = [];
  const vertex = new THREE.Vector3();
  for (let i: number = 0; i < 250; i++) {
    vertex.x = Math.random() * 2 - 1;
    vertex.y = Math.random() * 2 - 1;
    vertex.z = Math.random() * 2 - 1;
    vertex.multiplyScalar(r);

    vertices1.push(vertex.x, vertex.y, vertex.z);
  }
  for (let i: number = 0; i < 1500; i++) {
    vertex.x = Math.random() * 2 - 1;
    vertex.y = Math.random() * 2 - 1;
    vertex.z = Math.random() * 2 - 1;
    vertex.multiplyScalar(r);

    vertices2.push(vertex.x, vertex.y, vertex.z);
  }
  starsGeometry[0].setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices1, 3)
  );
  starsGeometry[1].setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices2, 3)
  );
  const starsMaterials: any[] = [
    new THREE.PointsMaterial({ color: 0x555555, size: 2, sizeAttenuation: false }),
    new THREE.PointsMaterial({ color: 0x555555, size: 1, sizeAttenuation: false }),
    new THREE.PointsMaterial({ color: 0x333333, size: 2, sizeAttenuation: false }),
    new THREE.PointsMaterial({ color: 0x3a3a3a, size: 1, sizeAttenuation: false }),
    new THREE.PointsMaterial({ color: 0x1a1a1a, size: 2, sizeAttenuation: false }),
    new THREE.PointsMaterial({ color: 0x1a1a1a, size: 1, sizeAttenuation: false }),
  ];
  for (let i: number = 10; i < 30; i++) {
    const stars = new THREE.Points(starsGeometry[i % 2], starsMaterials[i % 6]);

    stars.rotation.x = Math.random() * 6;
    stars.rotation.y = Math.random() * 6;
    stars.rotation.z = Math.random() * 6;
    stars.scale.setScalar(i * 10);

    stars.matrixAutoUpdate = false;
    stars.updateMatrix();

    scene.add(stars);
  }
};

const onWindowResize = (): void => {
  let width: number = container.parentNode.clientWidth;
  let height: number = container.parentNode.clientHeight;
  if (width === 0 || height === 0) {
    width = SCREEN_WIDTH;
    height = SCREEN_HEIGHT;
  }
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  composer.setSize(width, height);
};

const animate = (): void => {
  requestAnimationFrame(animate);
  // 旋转地球和云
  const delta: number = clock.getDelta();
  meshPlanet.rotation.y += rotationSpeed * delta;
  meshClouds.rotation.y += 1.25 * rotationSpeed * delta;
  composer.render(delta);
};

onMounted(() => {
  init();
});

onUnmounted(()=> {
  window.removeEventListener("resize", onWindowResize)
})
</script>

<style scoped>
.model-ca {
  position: relative;
}

.dg.ac {
  position: absolute;
  right: 0;
  top: 60px;
}
</style>
