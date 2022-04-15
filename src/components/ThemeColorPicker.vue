<template>
    <div class="prefix-cls">
        <template v-for="color in colorList || []" :key="color">
            <span
                @click="handleClick(color)"
                :class="[
                    `prefix-cls__item`,
                    {
                        [`prefix-cls__item--active`]: active === color
                    }
                ]"
                :style="{ background: color }"
            >
                <check color="#fff" />
            </span>
        </template>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, Ref } from "vue"
import { useStore } from "vuex"
import { Check } from "@element-plus/icons-vue"

export default defineComponent({
    name: "ThemeColorPicker",
    components: { Check },
    props: {
        colorList: {
            type: Array as PropType<string[]>,
            default: () => []
        }
    },
    setup(props) {
        const store = useStore()
        const active: Ref<string> = ref(props.colorList[0])
        if (store.getters.themeColor) {
            active.value = store.getters.themeColor
        }

        function handleClick(color: string) {
            active.value = color
            store.commit("SET_THEME_COLOR", color)
        }
        return {
            active,
            handleClick
        }
    }
})
</script>
<style lang="scss">
@import "@/css/theme.scss";

.prefix-cls {
    display: flex;
    flex-wrap: wrap;
    margin: 16px 0;
    justify-content: space-around;

    &__item {
        width: 20px;
        height: 20px;
        cursor: pointer;
        border: 1px solid #ddd;
        border-radius: 2px;

        svg {
            display: none;
        }

        &--active {
            svg {
                display: inline-block;
                font-size: 12px;
                fill: #fff !important;
            }
        }
    }
}
</style>
