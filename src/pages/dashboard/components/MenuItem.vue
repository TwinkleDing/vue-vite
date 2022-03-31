<template>
    <div class="menu-item">
        <template v-for="item in menu" :key="item.name">
            <el-menu-item
                v-if="!item.children || !item.children.length"
                :index="item.name"
                @click="open(item)"
            >
                <template #title>
                    <el-icon>
                        <help v-if="item.path.includes('home')" />
                        <coordinate v-if="item.path.includes('nested')" />
                        <histogram v-if="item.path.includes('chart')" />
                        <school v-if="item.path.includes('model')" />
                        <setting v-if="item.path.includes('permission')" />
                        <postcard v-if="item.path.includes('my')" />
                    </el-icon>
                    <span>{{ item.meta.label }}</span>
                </template>
            </el-menu-item>
            <el-sub-menu v-if="item.children && item.children.length" :index="item.name">
                <template #title>
                    <el-icon><icon-menu /></el-icon>
                    <span>{{ item.meta.label }}</span>
                </template>
                <menu-item :menu="item.children" />
            </el-sub-menu>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { useRoute, useRouter } from "vue-router"
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
        const menu = props.menu

        const open = (item: any) => {
            if (route.name !== item.name) {
                router.push(item.path)
            }
        }

        return {
            menu,
            open,
            route
        }
    }
})
</script>

<style lang="scss" scoped>
@import "@/css/theme.scss";
.menu-item {
    .no-active {
        font-size: 14px;
        display: flex;
        align-items: center;
        color: rgba(0, 0, 0, 0.65);
    }
    .active {
        color: $--color-primary;
    }
}
</style>
