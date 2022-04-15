<template>
    <div class="menu-item">
        <template v-for="item in menu" :key="item.name">
            <el-menu-item
                :style="{
                    background: item.path.includes(route.name) ? store.getters.systemTheme : ''
                }"
                class="menu-item-item"
                v-if="!item.children || !item.children.length"
                :index="item.name"
                @click="open(item)"
            >
                <template #title>
                    <div class="menu-icon">
                        <component :is="item.meta.icon"></component>
                    </div>
                    <span>{{ $t(item.name) }}</span>
                </template>
            </el-menu-item>
            <el-sub-menu v-if="item.children && item.children.length" :index="item.name">
                <template #title>
                    <div class="menu-icon">
                        <component :is="item.meta.icon"></component>
                    </div>
                    <span>{{ $t(item.name) }}</span>
                </template>
                <menu-item :menu="item.children" />
            </el-sub-menu>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useStore } from "vuex"
import {
    Menu as IconMenu,
    Coordinate,
    Help,
    Histogram,
    Setting,
    School,
    Postcard
} from "@element-plus/icons-vue"

export default defineComponent({
    name: "MenuItem",
    components: { IconMenu, Coordinate, Help, Histogram, Setting, School, Postcard },
    props: {
        menu: {
            type: Array,
            default: () => []
        }
    },
    setup(props: any) {
        const route = useRoute()
        const router = useRouter()
        const menu: any = reactive(props.menu)
        const store = useStore()

        const open = (item: any) => {
            if (route.name !== item.name) {
                console.log(1)

                router.push(item.path)
            }
        }

        return {
            menu,
            open,
            route,
            store
        }
    }
})
</script>

<style lang="scss">
@import "@/css/theme.scss";
.menu-item {
    .el-menu-item:hover,
    .el-sub-menu__title:hover {
        background-color: $--color-primary;
    }
    .no-active {
        font-size: 14px;
        display: flex;
        align-items: center;
        color: rgba(0, 0, 0, 0.65);
    }
    .active {
        color: $--color-primary;
    }
    .menu-icon {
        height: 20px;
        width: 20px;
        position: relative;
        margin-right: 20px;
        svg {
            position: absolute;
        }
    }
}
</style>
