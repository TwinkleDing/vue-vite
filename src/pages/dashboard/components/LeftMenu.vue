<template>
    <el-menu mode="vertical" :default-active="route.name">
        <menu-item :menu="menu" />
    </el-menu>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue"
import { useRoute } from "vue-router"
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
        const menu: any = reactive(props.menuList)

        return {
            menu,
            route
        }
    }
})
</script>
