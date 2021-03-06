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
                <check :color="iconColor" />
            </span>
        </template>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, Ref, getCurrentInstance, onMounted } from "vue"
import { useStore } from "vuex"
import { Check } from "@element-plus/icons-vue"

export default defineComponent({
    name: "ThemeColorPicker",
    components: { Check },
    props: {
        colorList: {
            type: Array as PropType<string[]>,
            default: () => []
        },
        def: {
            type: String,
            default: ""
        }
    },
    setup(props) {
        const { proxy }: any = getCurrentInstance()
        const active: Ref<string> = ref(props.def || props.colorList[0])
        const iconColor: Ref<string> = ref("#ffffff")

        const judgeColor = () => {
            if (active.value === "#ffffff") {
                iconColor.value = "#000000"
            } else {
                iconColor.value = "#ffffff"
            }
        }

        const handleClick = (color: string) => {
            active.value = color
            judgeColor()
            proxy.$emit("change", color)
        }

        onMounted(() => {
            judgeColor()
        })

        return {
            active,
            iconColor,
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
