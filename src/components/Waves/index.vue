<template>
  <div>
    <div id="model" class="model-ca" @keydown="keyDown"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useStore } from "vuex";
import * as THREE from "three";
const store = useStore();

const height: number = window.innerHeight;
const width: number = window.innerWidth;
const SCREEN_HEIGHT: number = height;
const SCREEN_WIDTH: number = width;
const SEPARATION: number = 100;
const AMOUNT_X: number = 50;
const AMOUNT_Y: number = 50;
let count: number = 0;

let container: any;
let particles: any;
let renderer: any;
let camera: any;
let scene: any;

const init = (): void => {
  camera = new THREE.PerspectiveCamera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
  camera.position.z = 1000;
  scene = new THREE.Scene();
  const numParticles = AMOUNT_X * AMOUNT_Y;
  const positions = new Float32Array(numParticles * 3);
  const scales = new Float32Array(numParticles);
  let i: number = 0,
    j: number = 0;
  for (let ix: number = 0; ix < AMOUNT_X; ix++) {
    for (let iy: number = 0; iy < AMOUNT_Y; iy++) {
      positions[i] = ix * SEPARATION - (AMOUNT_X * SEPARATION) / 2; // x
      positions[i + 1] = 0; // y
      positions[i + 2] = iy * SEPARATION - (AMOUNT_Y * SEPARATION) / 2; // z

      scales[j] = 1;

      i += 3;
      j++;
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));
  const material: any = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(store.getters.systemTheme) },
    },
    vertexShader: `
                    attribute float scale;
                    void main() {
                        vec4 mvPosition = modelViewMatrix * vec4( position, 2.0 );
                        gl_PointSize = scale * ( 300.0 / - mvPosition.z );
                        gl_Position = projectionMatrix * mvPosition;
                    }
                    `,
    fragmentShader: `
                    uniform vec3 color;
                    void main() {
                        if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
                        gl_FragColor = vec4( color, 1.0 );
                    }
                `,
  });
  particles = new THREE.Points(geometry, material);
  scene.add(particles);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  container = document.getElementById("model");
  container.appendChild(renderer.domElement);

  container.style.touchAction = "none";
  container.addEventListener("pointermove", onPointerMove);
  window.addEventListener("resize", onWindowResize);
};

const onWindowResize = (): void => {
  camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
  camera.updateProjectionMatrix();
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
};
const onPointerMove = (event: any): void => {
  if (event.isPrimary === false) return;
};
const animate = (): void => {
  requestAnimationFrame(animate);
  render();
};

const render = (): void => {
  camera.position.x += camera.position.x * 0.05;
  camera.position.y += (200 - camera.position.y) * 0.05;
  camera.lookAt(scene.position);
  const positions = particles.geometry.attributes.position.array;
  const scales = particles.geometry.attributes.scale.array;
  let i: number = 0;
  let j: number = 0;

  for (let ix: number = 0; ix < AMOUNT_X; ix++) {
    for (let iy: number = 0; iy < AMOUNT_Y; iy++) {
      positions[i + 1] =
        Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50;

      scales[j] =
        (Math.sin((ix + count) * 0.3) + 1) * 20 + (Math.sin((iy + count) * 0.5) + 1) * 20;

      i += 3;
      j++;
    }
  }

  particles.geometry.attributes.position.needsUpdate = true;
  particles.geometry.attributes.scale.needsUpdate = true;
  renderer.render(scene, camera);
  count += 0.1;
};
onMounted(() => {
  init();
  animate();
});
</script>

<style lang="scss" scoped>
.model-ca {
  position: relative;
}
.dg.ac {
  position: absolute;
  right: 0;
  top: 60px;
}
</style>
