<template>
    <div :class="[!store.getters.menuPosition ? 'flex' : '', 'menu-item']">
        <template v-for="item in menu" :key="item.name">
            <el-menu-item
                :style="{
                    background: store.getters.menuPosition
                        ? item.path.includes(route.name)
                            ? store.getters.systemTheme
                            : ''
                        : item.path.includes(route.name)
                        ? lighten(store.getters.headerTheme, 30)
                        : '',
                    color: store.getters.menuPosition
                        ? item.path.includes(route.name)
                            ? '#fff'
                            : ''
                        : ''
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
    import { lighten } from "@/utils/themeColor"
    import {
        Menu as IconMenu,
        Coordinate,
        Help,
        Histogram,
        Setting,
        School,
        Postcard,
        PieChart,
        Opportunity,
        VideoCameraFilled
    } from "@element-plus/icons-vue"

    export default defineComponent({
        name: "MenuItem",
        components: {
            IconMenu,
            Coordinate,
            Help,
            Histogram,
            Setting,
            School,
            Postcard,
            PieChart,
            Opportunity,
            VideoCameraFilled
        },
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
                    router.push(item.path)
                }
            }

            return {
                menu,
                open,
                route,
                store,
                lighten
            }
        }
    })
</script>

<style lang="scss">
    @import "@/css/theme.scss";
    .menu-item {
        .el-menu-item:hover,
        .el-sub-menu__title:hover {
            background-color: $--color-primary !important;
        }
        .el-menu-item:active,
        .el-sub-menu__title:active {
            background-color: $--color-primary !important;
        }
        &-item,
        .el-sub-menu__title {
            height: 100%;
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
                height: 20px;
                width: 20px;
                position: absolute;
            }
        }
    }
    .menu-top {
        .el-menu--horizontal {
            .menu-item {
                .el-sub-menu .el-sub-menu__icon-arrow {
                    right: 0 !important;
                }
            }

            .el-menu-item:hover,
            .el-sub-menu__title:hover {
                background-color: $--header-minor !important;
            }
            .el-menu-item:active,
            .el-sub-menu__title:active {
                background-color: $--header-minor !important;
            }
        }
    }
    .el-popper {
        .el-menu--horizontal {
            background: $--menu-primary;
            .el-sub-menu__title,
            .el-menu-item {
                background: $--menu-primary;
            }
            .menu-item {
                display: block;
            }
        }
    }
</style>
