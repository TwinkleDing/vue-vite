<template>
  <Renderer
    ref="rendererC"
    antialias
    :orbit-ctrl="{ enableDamping: true }"
    :shadow="true"
    :resize="true"
  >
    <Camera :position="{ z: 10 }" />
    <Scene>
      <PointLight :position="{ y: 50, z: 50 }" />
      <Box :size="1" ref="meshC" :rotation="{ y: Math.PI / 4, z: Math.PI / 4 }">
        <LambertMaterial />
      </Box>
    </Scene>
  </Renderer>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted, watch } from "vue";
import {
  Box,
  Camera,
  LambertMaterial,
  MeshPublicInterface,
  PointLight,
  Renderer,
  RendererPublicInterface,
  Scene,
} from "troisjs";

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
const rendererC = ref();
const meshC = ref();
let renderer = null;
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

onMounted(() => {
  renderer = rendererC.value as RendererPublicInterface;
  renderer.three.setSize(props.width, props.height);

  const mesh = (meshC.value as MeshPublicInterface).mesh;
  renderer.onBeforeRender(() => {
    mesh!.rotation.x += 0.01;
  });
});
</script>

<style scoped lang="scss"></style>
