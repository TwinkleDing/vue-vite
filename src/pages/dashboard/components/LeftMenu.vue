<template>
    <el-menu mode="vertical">
        <menu-item :menu="menu" />
    </el-menu>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, Ref } from "vue"
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
        const menu: any = reactive(props.menuList)
        return {
            menu
        }
    }
})
</script>
