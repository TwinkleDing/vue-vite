<template>
    <div class="system-setting" :style="{ left: x, top: y }">
        <div
            class="box"
            @mousedown="mouseDown"
            @mousemove="mouseMove"
            @mouseup="mouseUp"
            @mouseout="mouseOut"
        >
        </div>
        <cpu class="icon" />
    </div>
    <el-drawer v-model="drawer" :title="$t('system')" custom-class="system-drawer">
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
            <el-divider class="title">{{ $t("menuTheme") }}</el-divider>
            <theme-color-picker
                :colorList="menuThemeList"
                :def="menuTheme"
                @change="menuThemeChange"
            />
        </div>
        <div>
            <el-divider class="title">{{ $t("interfaceSettings") }}</el-divider>
            <el-row>
                <el-col :span="20">{{ $t("labelTab") }}</el-col>
                <el-col :span="4"><el-switch v-model="tabsShow" @change="tabsChange" /></el-col>
            </el-row>
        </div>
    </el-drawer>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, onMounted } from "vue"
import { useStore } from "vuex"
import { Cpu } from "@element-plus/icons-vue"
import {
    APP_PRESET_COLOR_LIST,
    HEADER_PRESET_BG_COLOR_LIST,
    SIDE_BAR_BG_COLOR_LIST
} from "@/settings/designSetting"
import ThemeColorPicker from "@/components/ThemeColorPicker.vue"
export default defineComponent({
    name: "SystemIcon",
    components: { Cpu, ThemeColorPicker },
    setup() {
        const store = useStore()
        const tabsShow: Ref<boolean> = ref(store.getters.tabsShow)
        const systemThemeList = APP_PRESET_COLOR_LIST
        const headerThemeList = HEADER_PRESET_BG_COLOR_LIST
        const menuThemeList = SIDE_BAR_BG_COLOR_LIST
        const systemTheme = store.getters.systemTheme
        const headerTheme = store.getters.headerTheme
        const menuTheme = store.getters.menuTheme

        const systemMouse = new SystemMouse()
        const x: Ref<string> = ref(systemMouse.x)
        const y: Ref<string> = ref(systemMouse.y)
        const drawer: Ref<Boolean> = ref(false)
        const mouseDown = (e: any) => {
            systemMouse.mouseDown(e)
        }
        const mouseOut = systemMouse.mouseOut
        const mouseMove = async (e: any) => {
            const coordinates: any = await systemMouse.mouseMove(e)
            x.value = coordinates.x
            y.value = coordinates.y
        }
        const mouseUp = async () => {
            const coordinates: any = await systemMouse.mouseUp()
            if (coordinates.drawer) {
                drawer.value = true
                return
            }
            x.value = coordinates.x
            y.value = coordinates.y
            store.commit("SET_SYSTEM_ICON_POSITION", {
                x: coordinates.x,
                y: coordinates.y
            })
        }

        const systemThemeChange = (color: string) => {
            store.commit("SET_SYSTEM_THEME", color)
        }
        const menuThemeChange = (color: string) => {
            store.commit("SET_MENU_THEME", color)
        }
        const headerThemeChange = (color: string) => {
            store.commit("SET_HEADER_THEME", color)
        }
        const tabsChange = (e: boolean) => {
            store.commit("SET_TABS_SHOW", e)
        }

        onMounted(() => {
            const systemIcon = store.getters.systemIcon
            if (store.getters.systemIcon) {
                x.value = systemIcon.x
                y.value = systemIcon.y
            }
        })
        return {
            drawer,
            x,
            y,
            systemTheme,
            menuTheme,
            systemThemeList,
            menuThemeList,
            tabsShow,
            mouseDown,
            mouseMove,
            mouseUp,
            mouseOut,
            systemThemeChange,
            menuThemeChange,
            headerThemeList,
            headerTheme,
            headerThemeChange,
            tabsChange
        }
    }
})

class SystemMouse {
    timer: any
    downTime: number
    down: boolean
    offsetX: number
    offsetY: number
    x: string
    y: string
    constructor() {
        this.timer = null
        this.downTime = 0
        this.down = false
        this.offsetX = 0
        this.offsetY = 0
        this.x = "0"
        this.y = "40%"
    }
    mouseDown = (e: any) => {
        this.downTime = new Date().getTime()
        this.down = true
        this.offsetX = e.offsetX
        this.offsetY = e.offsetY
    }
    mouseMove = (e: any) => {
        return new Promise((resolve) => {
            clearTimeout(this.timer)
            if (!this.down) return
            this.x = e.clientX - this.offsetX + "px"
            this.y = e.clientY - this.offsetY + "px"
            resolve({ x: this.x, y: this.y })
        })
    }
    mouseOut = () => {
        this.timer = setTimeout(() => {
            this.down = false
        }, 500)
    }
    mouseUp = () => {
        return new Promise((resolve) => {
            clearTimeout(this.timer)
            if (new Date().getTime() - this.downTime < 300) {
                resolve({ drawer: true })
                return
            }
            this.down = false
            resolve({ x: this.x, y: this.y })
        })
    }
}
</script>

<style lang="scss">
@import "@/css/theme.scss";

.system-setting {
    height: 50px;
    width: 50px;
    position: fixed;
    right: 0;
    top: 40%;
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
    }
    .title div {
        font-size: 16px !important;
    }
}
</style>
