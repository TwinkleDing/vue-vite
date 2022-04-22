<template>
    <el-menu
        class="left-menu"
        :text-color="store.getters.menuTheme === '#ffffff' ? '#303133' : '#ffffffA6'"
        :style="{ background: store.getters.menuPosition ? store.getters.menuTheme + '!important' : 'transform' }"
        :mode="store.getters.menuPosition ? 'vertical' : 'horizontal'"
        active-text-color="#ffffff"
        :collapse-transition="false"
    >
        <menu-item :menu="menu" />
    </el-menu>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue"
import { useRoute } from "vue-router"
import { useStore } from "vuex"
import MenuItem from "./MenuItem.vue"

export default defineComponent({
    name: "LeftMenu",
    components: { MenuItem },
    props: {
        menuList: {
            type: Array,
            default: () => []
        }
    },
    setup(props: any) {
        const route = useRoute()
        const store = useStore()

        const menu: any = reactive(props.menuList)

        return {
            menu,
            route,
            store
        }
    }
})
</script>

<style lang="scss">
.left-menu {
    height: 100%;
}
</style>
