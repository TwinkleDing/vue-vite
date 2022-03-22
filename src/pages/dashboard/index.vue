<template>
    <div class="pages">
        <div class="pages-header">
            <div class="header-background"></div>
            <div class="logo"></div>
            <div class="avatar">
                <span>{{ userInfo.account }}</span>
                <el-avatar :size="size" :src="imgUrl" />
            </div>
        </div>
        <div class="pages-content">
            <div class="pages-left">
                <left-menu :menuList="menuList" />
            </div>
            <div class="pages-right"></div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, Ref } from "vue"
import { useStore } from "vuex"
import LeftMenu from "./components/LeftMenu.vue"

interface MenuList {
    name: string
    key: string
    router: string
    children?: any
}

export default defineComponent({
    name: "Dashboard",
    components: { LeftMenu },
    setup() {
        const store = useStore()
        const menuList: MenuList[] = [
            {
                name: "菜单一",
                key: "menu1",
                router: "menu1"
            },
            {
                name: "菜单二",
                key: "menu2",
                router: "menu2",
                children: [
                    {
                        name: "菜单二一",
                        key: "menu21",
                        router: "menu21",
                        children: [
                            {
                                name: "菜单二一一",
                                key: "menu211",
                                router: "menu211"
                            },
                            {
                                name: "菜单二一二",
                                key: "menu212",
                                router: "menu212"
                            }
                        ]
                    },
                    {
                        name: "菜单二二",
                        key: "menu22",
                        router: "menu22"
                    }
                ]
            },
            {
                name: "菜单三",
                key: "menu3",
                router: "menu3"
            },
            {
                name: "菜单四",
                key: "menu4",
                router: "menu4"
            },
            {
                name: "菜单五",
                key: "menu5",
                router: "menu5"
            }
        ]
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
            width: 200px;
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
        box-shadow: 6px 0px 10px 0px rgb(38 38 38 / 8%);
    }
    &-right {
        height: 100%;
        flex: 1;
    }
}
</style>