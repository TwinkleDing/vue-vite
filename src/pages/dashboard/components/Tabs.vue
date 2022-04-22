<template>
    <div v-if="store.getters.tabsType === 1" class="router-history1">
        <div
            :class="[route.path === item.path ? 'router-history-active' : '']"
            v-for="(item, index) in routeHistory"
            :key="index"
        >
            <span v-if="route.path === item.path" class="current-router"></span>
            <span @click="routeGo(item.path)">{{ item.label }}</span>
            <span v-if="!item.path.includes('home')">
                <el-icon
                    :size="16"
                    :color="route.path === item.path ? '#fff' : '#495060'"
                    @click="closeCurrentRoute(index)"
                    ><circle-close
                /></el-icon>
            </span>
        </div>
    </div>
    <div v-if="store.getters.tabsType === 2" class="router-history2">
        <div
            :class="[route.path === item.path ? 'router-history-active' : '']"
            v-for="(item, index) in routeHistory"
            :key="index"
        >
            <span class="router-history-name" @click="routeGo(item.path)">{{ item.label }}</span>
            <span>
                <el-icon
                    v-if="!item.path.includes('home')"
                    :size="16"
                    color="#fff"
                    @click="closeCurrentRoute(index)"
                    ><close
                /></el-icon>
            </span>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue"
import { useStore } from "vuex"
import { useRoute, useRouter } from "vue-router"
import { CircleClose, Close } from "@element-plus/icons-vue"
export default defineComponent({
    name: "Tabs",
    components: { CircleClose, Close },
    setup() {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()

        const routeHistory = computed(() => {
            const history = store.getters.routeHistory
            const list = diGui(store.getters.routeList, [])
            let showHistory: any = []
            history.map((item: any) => {
                list.map((element: any) => {
                    if (element.path === item.path) {
                        showHistory.push(item)
                    }
                })
            })
            store.commit("SET_ROUTE_HISTORY", showHistory)
            return showHistory
        })
        const diGui = (list: any, parent: any) => {
            list.map((element: any) => {
                if (element.children) {
                    diGui(element.children, parent)
                } else {
                    parent.push(element)
                }
                return element
            })
            return parent
        }
        const routeGo = (path: string) => router.push(path)

        const closeCurrentRoute = (index: number) => {
            store.commit("REMOVE_ROUTE_HISTORY", index)
        }
        return {
            routeHistory,
            route,
            store,
            routeGo,
            closeCurrentRoute
        }
    }
})
</script>

<style lang="scss" scoped>
@import "@/css/theme.scss";
.router-history1 {
    height: 40px;
    width: 100%;
    position: fixed;
    top: 60px;
    box-shadow: 6px 10px 10px 0px rgb(38 38 38 / 8%);
    background: #fff;
    z-index: 100;
    padding: 6px;
    box-sizing: border-box;
    div {
        display: inline-block;
        padding: 0 6px;
        margin: 0 6px;
        border: 1px solid #d8dce5;
        color: #495060;
        cursor: pointer;
        span {
            padding: 4px 4px;
            display: inline-block;
            vertical-align: middle;
            i {
                display: inline-block;
                vertical-align: text-bottom;
            }
        }
        .current-router {
            padding: 0;
            width: 8px;
            height: 8px;
            background-image: linear-gradient(to top right, $--color-primary, $--color-minor);
            border-radius: 50%;
        }
    }
    .router-history-active {
        background-image: linear-gradient(to top right, $--color-minor, $--color-primary);
        color: #fff !important;
    }
}
.router-history2 {
    height: 40px;
    width: 100%;
    position: fixed;
    top: 60px;
    box-shadow: 6px 10px 10px 0px rgb(38 38 38 / 8%);
    background: #fff;
    z-index: 100;
    padding: 6px 6px 0;
    box-sizing: border-box;
    div {
        display: inline-block;
        padding: 0 6px;
        color: #495060;
        height: 100%;
        cursor: pointer;
        &:hover {
            // background-image: linear-gradient(to top right, $--color-minor, $--color-primary);
            background-color: $--color-primary;
            color: #fff !important;
            border-radius: 6px 6px 0 0;
            .router-history-name {
                transition: 0.3s;
                padding-left: 12px;
            }
            i {
                transition: 0.3s;
                width: 16px;
            }
        }
        .router-history-name {
            transition: 0.3s;
            padding-left: 4px;
        }
        span {
            padding: 4px 4px;
            display: inline-block;
            vertical-align: middle;
            i {
                display: inline-block;
                vertical-align: text-bottom;
                width: 0;
                overflow: hidden;
            }
        }
        .current-router {
            padding: 0;
            width: 8px;
            height: 8px;
            background-image: linear-gradient(to top right, $--color-primary, $--color-minor);
            border-radius: 50%;
        }
    }
    .router-history-active {
        background-image: linear-gradient(to top right, $--color-minor, $--color-primary);
        color: #fff !important;
        border-radius: 6px 6px 0 0;
        .router-history-name {
            transition: 0.3s;
            padding-left: 12px;
        }
        i {
            transition: 0.3s;
            width: 16px;
        }
    }
}
</style>