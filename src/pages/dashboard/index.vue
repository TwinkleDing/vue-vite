<template>
    <div class="pages">
        <div class="pages-header">
            <div class="header-background"></div>
            <div class="logo">
                <img src="@/assets/logo.png" alt="" srcset="" />
                <i>VUE+VITE+TS</i>
            </div>
            <el-dropdown placement="bottom-end">
                <div class="avatar">
                    <span>{{ userInfo.account }}</span>
                    <el-avatar :size="size" :src="imgUrl" />
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="drClick(1)">{{ $t("myInfo") }}</el-dropdown-item>
                        <el-dropdown-item @click="drClick(2)">{{ $t("logout") }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <div class="pages-content">
            <div class="pages-left">
                <left-menu :menuList="menuList" />
            </div>
            <div class="pages-right">
                <div class="router-history">
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
                <div class="right-content">
                    <router-view></router-view>
                </div>
            </div>
        </div>
        <system-icon />
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, Ref, computed } from "vue"
import { useStore } from "vuex"
import { useRoute, useRouter } from "vue-router"
import LeftMenu from "./components/LeftMenu.vue"
import routeList from "@/router/routeList"
import { RouterItem } from "@/utils/interface"
import { CircleClose } from "@element-plus/icons-vue"
import { ElMessageBox, ElMessage } from "element-plus"
import SystemIcon from "./components/SystemIcon.vue"

export default defineComponent({
    name: "Dashboard",
    components: { LeftMenu, CircleClose, SystemIcon },
    setup() {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const menuList: RouterItem[] = [...store.getters.routeList]
        const userInfo: any = reactive(store.getters.userInfo)
        const imgUrl: Ref<string> = ref(
            "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        )
        const size: Ref<string> = ref("default")
        const routeHistory = computed(() => {
            const history = store.getters.routeHistory
            const list = digui(store.getters.routeList, [])
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
        const digui = (list: any, parent: any) => {
            list.map((element: any) => {
                if (element.children) {
                    digui(element.children, parent)
                } else {
                    parent.push(element)
                }
                return element
            })
            return parent
        }
        const closeCurrentRoute = (index: number) => {
            store.commit("REMOVE_ROUTE_HISTORY", index)
        }
        const routeGo = (path: string) => router.push(path)
        const drClick = (type: number) => {
            if (type === 1) {
                router.push("my")
            } else if (type === 2) {
                ElMessageBox.confirm("是否确认退出登录?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消"
                })
                    .then(() => {
                        router.push("login")
                        ElMessage({
                            type: "success",
                            message: "退出成功"
                        })
                    })
                    .catch(() => {})
            }
        }

        return {
            menuList,
            userInfo,
            imgUrl,
            size,
            routeHistory,
            route,
            routeGo,
            drClick,
            closeCurrentRoute
        }
    }
})
</script>

<style lang="scss" scoped>
@import "@/css/theme.scss";
.pages {
    height: 100%;
    width: 100%;
    min-width: 1000px;
    &-header {
        height: 60px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        position: relative;
        .header-background {
            position: absolute;
            height: 100%;
            width: 100%;
            background-image: linear-gradient(to top right, $--color-primary, $--color-minor);
            z-index: -1;
        }
        .logo {
            height: 100%;
            min-width: 200px;
            padding: 0 20px;
            display: flex;
            align-items: center;
            img {
                height: 50px;
                width: 50px;
            }
            i {
                color: #fff;
                font-size: 36px;
                font-family: fangsong;
            }
        }
        .avatar {
            height: 100%;
            font-size: 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-width: 150px;
            margin: 0 20px;
            color: #fff;
            cursor: pointer;
        }
    }
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
        .router-history {
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
                    background-image: linear-gradient(
                        to top right,
                        $--color-primary,
                        $--color-minor
                    );
                    border-radius: 50%;
                }
            }
        }
        .router-history-active {
            background-image: linear-gradient(to top right, $--color-minor, $--color-primary);
            color: #fff !important;
        }
        .right-content {
            margin-top: 40px;
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