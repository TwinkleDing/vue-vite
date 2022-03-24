<template>
    <div class="pages">
        <div class="pages-header">
            <div class="header-background"></div>
            <div class="logo">
                <img src="@/assets/logo.png" alt="" srcset="" />
                <i>VUE+VITE+TS</i>
            </div>
            <div class="avatar">
                <span>{{ userInfo.account }}</span>
                <el-avatar :size="size" :src="imgUrl" />
            </div>
        </div>
        <div class="pages-content">
            <div class="pages-left">
                <left-menu :menuList="menuList" />
            </div>
            <div class="pages-right">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, Ref } from "vue"
import { useStore } from "vuex"
import LeftMenu from "./components/LeftMenu.vue"
import routeList from "@/router/routeList"
import { RouterItem } from "@/utils/interface"

export default defineComponent({
    name: "Dashboard",
    components: { LeftMenu },
    setup() {
        const store = useStore()
        const menuList: RouterItem[] = [...routeList]
        const userInfo: any = reactive(store.getters.userInfo)
        const imgUrl: Ref<string> = ref(
            "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        )
        const size: Ref<string> = ref("default")
        return {
            menuList,
            userInfo,
            imgUrl,
            size
        }
    }
})
</script>

<style lang="scss" scoped>
@import "@/css/theme.scss";
.pages {
    height: 100%;
    width: 100%;
    min-width: 1400px;
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
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-width: 150px;
            margin: 0 20px;
            color: #fff;
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
    }
}
</style>