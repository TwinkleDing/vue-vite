<template>
    <div class="system-setting" :style="{ left: x, top: y }">
        <div
            class="box"
            @click="openSystem"
            @mousedown="mouseDown"
            @mousemove="mouseMove"
            @mouseup="mouseUp"
            @mouseout="mouseOut"
        >
        </div>
        <cpu class="icon" />
    </div>
    <el-drawer v-model="drawer" :title="$t('system')">
        <div>{{ $t("themeColor") }}</div>
        <div>{{ $t("language") }}</div>
    </el-drawer>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, onMounted } from "vue"
import { useStore } from "vuex"
import { Cpu } from "@element-plus/icons-vue"
export default defineComponent({
    name: "SystemIcon",
    components: { Cpu },
    setup() {
        const store = useStore()
        const drawer: Ref<boolean> = ref(false)
        const downTime: Ref<number> = ref(0)
        const down: Ref<boolean> = ref(false)
        const x: Ref<string> = ref("0")
        const y: Ref<string> = ref("40%")
        const offsetX: Ref<number> = ref(0)
        const offsetY: Ref<number> = ref(0)
        let timer: any = null
        const openSystem = () => {
            // drawer.value = true
        }

        const mouseDown = (e: any) => {
            downTime.value = new Date().getTime()
            down.value = true
            offsetX.value = e.offsetX
            offsetY.value = e.offsetY
        }
        const mouseMove = (e: any) => {
            clearTimeout(timer)
            if (!down.value) return
            x.value = e.clientX - offsetX.value + "px"
            y.value = e.clientY - offsetY.value + "px"
        }

        const mouseOut = () => {
            timer = setTimeout(() => {
                down.value = false
            }, 500)
        }
        const mouseUp = () => {
            clearTimeout(timer)
            if (new Date().getTime() - downTime.value < 300) {
                drawer.value = true
                return
            }
            down.value = false
            store.commit("SET_SYSTEM_ICON_POSITION", {
                x: x.value,
                y: y.value
            })
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
            openSystem,
            mouseDown,
            mouseMove,
            mouseUp,
            mouseOut
        }
    }
})
</script>

<style lang="scss" scoped>
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
</style>
