<template>
  <div class="system-setting" :style="{ left: x + 'px', top: y + 'px' }">
    <div
      class="box"
      @mousedown="mouseDown"
      @mousemove="mouseMove"
      @mouseup="mouseUp"
      @mouseout="mouseOut"
    ></div>
    <Cpu class="icon" />
  </div>
  <el-drawer
    v-model="drawerVisible"
    size="350px"
    custom-class="system-drawer"
    :direction="direction"
  >
    <template #title>
      <h3>{{ $t("system") }}</h3>
    </template>
    <div>
      <el-divider class="title">{{ $t("systemTheme") }}</el-divider>
      <theme-color-picker
        :colorList="systemThemeList"
        :def="systemTheme"
        @change="systemThemeChange"
      />
      <el-divider class="title">{{ $t("headerTheme") }}</el-divider>
      <theme-color-picker
        :colorList="headerThemeList"
        :def="headerTheme"
        @change="headerThemeChange"
      />
      <template v-if="store.getters.menuPosition">
        <el-divider class="title">{{ $t("menuTheme") }}</el-divider>
        <theme-color-picker
          :colorList="menuThemeList"
          :def="menuTheme"
          @change="menuThemeChange"
        />
      </template>
    </div>
    <div class="interface-set">
      <el-divider class="title">{{ $t("interfaceSettings") }}</el-divider>
      <el-row class="row">
        <el-col :span="tabsShow ? 8 : 16">{{ $t("labelTab") }}</el-col>
        <el-col :span="8" v-if="tabsShow" align="center">
          <el-select
            v-model="tabsType"
            @change="tabsTypeChange"
            placeholder="Select"
            size="small"
          >
            <el-option :label="$t('tabSimple')" :value="1" />
            <el-option :label="$t('tabCard')" :value="2" />
          </el-select>
        </el-col>
        <el-col :span="8" align="center">
          <el-switch v-model="tabsShow" @change="tabsChange" />
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="16">{{ $t("menuPosition") }}</el-col>
        <el-col :span="8" align="center">
          <el-switch
            inline-prompt
            active-text="👈"
            inactive-text="👆"
            :inactive-color="store.getters.systemTheme"
            v-model="menuPosition"
            @change="menuPositionChange"
          />
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="16">{{ $t("language") }}</el-col>
        <el-col :span="8" align="center">
          <el-switch
            inline-prompt
            :active-text="$t('chinese')"
            :inactive-text="$t('english')"
            active-value="zh"
            inactive-value="en"
            :inactive-color="store.getters.systemTheme"
            v-model="language"
            @change="languageChange"
          />
        </el-col>
      </el-row>
    </div>
  </el-drawer>
</template>
<script setup lang="ts">
import { defineComponent, getCurrentInstance, ref, Ref, onMounted } from "vue";
import { useStore } from "vuex";
import { Cpu } from "@element-plus/icons-vue";
import {
  APP_PRESET_COLOR_LIST,
  HEADER_PRESET_BG_COLOR_LIST,
  SIDE_BAR_BG_COLOR_LIST,
} from "@/settings/designSetting";
import ThemeColorPicker from "@/components/ThemeColorPicker/index.vue";
import { SystemIcon } from "@/utils/interface";
import SystemMouse from "./SystemMouse";
const { proxy }: any = getCurrentInstance();
const store = useStore();
const tabsShow: Ref<boolean> = ref(store.getters.tabsShow);
const menuPosition: Ref<boolean> = ref(store.getters.menuPosition);
const tabsType: Ref<number> = ref(store.getters.tabsType);
const language: Ref<string> = ref(store.getters.language);

const systemThemeList = APP_PRESET_COLOR_LIST;
const headerThemeList = HEADER_PRESET_BG_COLOR_LIST;
const menuThemeList = SIDE_BAR_BG_COLOR_LIST;
const systemTheme = store.getters.systemTheme;
const headerTheme = store.getters.headerTheme;
const menuTheme = store.getters.menuTheme;

const systemMouse = new SystemMouse();
const x: Ref<number> = ref(systemMouse.x);
const y: Ref<number> = ref(systemMouse.y);
const drawerVisible: Ref<Boolean> = ref(false);
const direction: Ref<String> = ref(
  (window as any).config.ArLanuages?.includes(language.value) ? "ltr" : "rtl"
);
const mouseDown = (e: any): void => {
  systemMouse.mouseDown(e);
};
const mouseOut = systemMouse.mouseOut;
const mouseMove = async (e: any): void => {
  const coordinates: any = await systemMouse.mouseMove(e);
  x.value = coordinates.x;
  y.value = coordinates.y;
};
const mouseUp = async (): void => {
  const coordinates: any = await systemMouse.mouseUp();
  if (coordinates.drawer) {
    drawerVisible.value = true;
    return;
  }
  x.value = coordinates.x;
  y.value = coordinates.y;
  store.commit("SET_SYSTEM_ICON_POSITION", {
    x: coordinates.x,
    y: coordinates.y,
  });
};

const systemThemeChange = (color: string): void => {
  store.commit("SET_SYSTEM_THEME", color);
};
const menuThemeChange = (color: string): void => {
  store.commit("SET_MENU_THEME", color);
};
const headerThemeChange = (color: string): void => {
  store.commit("SET_HEADER_THEME", color);
};
const tabsChange = (e: boolean): void => {
  store.commit("SET_TABS_SHOW", e);
};
const tabsTypeChange = (e: number): void => {
  store.commit("SET_TABS_TYPE", e);
};
const menuPositionChange = (e: boolean): void => {
  store.commit("SET_MENU_POSITION", e);
  if (!e) {
    menuThemeChange(menuThemeList[0]);
  }
};
const languageChange = (lang: string): void => {
  const ArLanuages: string[] = (window as any).config.ArLanuages || [];
  proxy.$i18n.locale = lang;
  direction.value = ArLanuages.includes(lang) ? "ltr" : "rtl";
  store.commit("SET_LANGUAGE", lang);
};

onMounted(() => {
  const systemIcon: SystemIcon | null = store.getters.systemIcon;
  if (systemIcon) {
    x.value = systemIcon.x;
    y.value = systemIcon.y;
  }
});
</script>

<style lang="scss">
@import "@/css/theme.scss";

.system-setting {
  height: 50px;
  width: 50px;
  position: fixed;
  color: #fff;
  font-size: 30px;
  background-image: linear-gradient(to bottom right, $--color-primary, $--color-minor);
  border-radius: 10px;
  cursor: pointer;
  z-index: 100;
  .box {
    z-index: 2;
    height: 100%;
    width: 100%;
    position: absolute;
  }
  .icon {
    height: 30px;
    position: absolute;
    z-index: 0;
    left: 10px;
    top: 10px;
  }
}
.system-drawer {
  header {
    margin: 0;
    h3 {
      line-height: 24px;
    }
  }
  .title div {
    font-size: 16px !important;
    display: inline-block;
    position: relative;
    text-align: center;
  }
  .interface-set .row {
    align-items: center;
  }
}
</style>
