<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>
<script setup lang="ts">
import { watch, ref } from "vue";
import { getStore } from "@/utils/storage";
import { useStore } from "vuex";
import { ElConfigProvider } from "element-plus";
import zh from "element-plus/dist/locale/zh-cn.mjs";
import en from "element-plus/dist/locale/en.mjs";

const store = useStore();
let locale: any = ref(zh);

watch(
  () => store.getters.language,
  (e) => {
    locale = e === "zh" ? zh : en;
  },
  {
    immediate: true, // 立即执行
    deep: true, // 深度监听
  }
);
store.commit(
  "SET_SYSTEM_THEME",
  getStore({ name: "systemTheme" })
    ? getStore({ name: "systemTheme" })
    : store.getters.systemTheme
);
store.commit(
  "SET_MENU_THEME",
  getStore({ name: "menuTheme" })
    ? getStore({ name: "menuTheme" })
    : store.getters.menuTheme
);
store.commit(
  "SET_HEADER_THEME",
  getStore({ name: "headerTheme" })
    ? getStore({ name: "headerTheme" })
    : store.getters.headerTheme
);
</script>
