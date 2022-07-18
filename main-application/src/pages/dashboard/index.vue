<template>
    <div class="pages">
        <header-top>
            <template v-if="!store.getters.menuPosition" #menu>
                <left-menu :menuList="menuList" />
            </template>
        </header-top>
        <div class="pages-content">
            <div v-if="store.getters.menuPosition" class="pages-left">
                <left-menu :menuList="menuList" />
            </div>
            <div class="pages-right">
                <tabs v-if="store.getters.tabsShow" />
                <div :class="['right-content', !store.getters.tabsShow || 'mg-t-40']">
                    <div v-show="micro" id="frame"></div>
                    <div v-show="!micro" id="main">
                        <router-view></router-view>
                    </div>
                </div>
            </div>
        </div>
        <system-icon />
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, watch } from "vue"
import { useStore } from "vuex"
import { useRoute } from "vue-router"
import LeftMenu from "./components/LeftMenu.vue"
import { RouterItem } from "@/utils/interface"
import SystemIcon from "./components/SystemIcon.vue"
import HeaderTop from "./components/HeaderTop.vue"
import Tabs from "./components/Tabs.vue"
import initMicro from "@/micro"

export default defineComponent({
    name: "Dashboard",
    components: { LeftMenu, SystemIcon, Tabs, HeaderTop },
    setup() {
        const store = useStore()
        const route = useRoute()
        const micro: Ref<boolean> = ref(false)
        const menuList: RouterItem[] = [...store.getters.routeList]

         watch(
                () => route,
                () => {
                    if(route.path.includes('micro')) {
                        micro.value = true
                        const apps = [
                            {
                                name: "MicroApp",
                                entry: "//localhost:668",
                                container: "#frame",
                                activeRule: "/micro",
                            }
                        ]
                        initMicro(apps)
                    } else {
                        micro.value = false
                    }
                },
                {
                    immediate: true, // 立即执行
                    deep: true // 深度监听
                }
            )
        return {
            micro,
            menuList,
            route,
            store
        }
    }
})
</script>

<style lang="scss" scoped>
.pages {
    height: 100%;
    width: 100%;
    min-width: 1000px;
    &-content {
        width: 100%;
        height: calc(100% - 60px);
        display: flex;
    }
    &-left {
        height: 100%;
        width: 200px;
        min-width: 200px;
        box-shadow: 6px 0px 10px 0px rgb(38 38 38 / 8%);
    }
    &-right {
        height: 100%;
        flex: 1;
        overflow: auto;
        position: relative;
        .right-content {
            padding: 20px;
            box-sizing: border-box;
            position: absolute;
            top: 0;
            width: 100%;
            min-height: calc(100% - 40px);
        }
    }
}
</style>