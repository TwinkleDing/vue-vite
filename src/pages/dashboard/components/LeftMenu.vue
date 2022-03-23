<template>
    <el-menu mode="vertical" :active-text-color="themeColor" :default-active="route.name">
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
        const themeColor = store.getters.themeColor

        return {
            menu,
            themeColor,
            route
        }
    }
})
</script>
