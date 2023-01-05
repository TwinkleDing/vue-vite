<template>
  <el-menu
    class="left-menu scrollbar header-scrollbar-color"
    :text-color="store.getters.menuTheme === '#ffffff' ? '#303133' : '#ffffffA6'"
    :style="{
      background: store.getters.menuPosition
        ? store.getters.menuTheme + '!important'
        : 'transform',
    }"
    :mode="store.getters.menuPosition ? 'vertical' : 'horizontal'"
    active-text-color="#ffffff"
    :collapse-transition="false"
    :ellipsis="false"
    :collapse="false"
  >
    <!-- :default-active="store.getters.currentRoute.name" -->
    <menu-item :menu="menu" />
  </el-menu>
</template>

<script setup lang="ts">
import { defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import MenuItem from "./MenuItem.vue";
const props = defineProps({
  menuList: {
    type: Array,
    default: () => [],
  },
});
const route = useRoute();
const store = useStore();
const menu: any = reactive(props.menuList);
</script>

<style lang="scss">
.left-menu {
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
}
</style>
