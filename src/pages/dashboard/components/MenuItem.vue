<template>
    <div class="menu-item">
        <template v-for="item in menu" :key="item.key">
            <el-menu-item
                v-if="!item.children || !item.children.length"
                :index="item.key"
                @click="open(item)"
            >
                <template #title>
                    <div class="no-active">
                        <el-icon><coordinate /></el-icon>
                        <span>{{ item.name }}</span>
                    </div>
                </template>
            </el-menu-item>
            <el-sub-menu
                v-if="item.children && item.children.length"
                :key="item.key"
                :index="item.key"
            >
                <template #title>
                    <div class="no-active">
                        <el-icon><icon-menu /></el-icon>
                        <span>{{ item.name }}</span>
                    </div>
                </template>
                <menu-item :menu="item.children" />
            </el-sub-menu>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { useRoute, useRouter } from "vue-router"
import { Menu as IconMenu, Coordinate } from "@element-plus/icons-vue"

export default defineComponent({
    name: "MenuItem",
    components: { IconMenu, Coordinate },
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
                router.push(item.router)
            }
        }
        return {
            menu,
            open
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
