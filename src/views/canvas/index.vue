<template>
    <div>
        <el-button type="primary" @click="clear" class="clear-button">清空画布</el-button>
        <canvas
            id="canvas"
            class="canvas"
            height="800"
            width="1000"
            @mousedown="drawStart"
            @mousemove="drawing"
            @mouseup="drawEnd"
        />
    </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue"
import { useStore } from "vuex"
const store = useStore()
const mouseBeginX = ref(0)
const mouseBeginY = ref(0)
const canvas = reactive({})
const context = reactive({})
const start = ref(false)
const mouseX = ref(0)
const mouseY = ref(0)
const color = ref(store.getters.systemTheme)

const drawStart = (e) => {
    mouseBeginX.value = e.clientX - canvas.value.offsetLeft - 200
    mouseBeginY.value = e.clientY - canvas.value.offsetTop - 100
    context.value.moveTo(mouseBeginX.value, mouseBeginY.value)
    start.value = true
}
const drawing = (e) => {
    if (start.value) {
        openDraw(e)
    }
}
const drawEnd = (e) => {
    start.value = false
}
const openDraw = (e) => {
    let ctx = context.value
    ctx.strokeStyle = color.value
    mouseX.value = e.clientX - canvas.value.offsetLeft - 200
    mouseY.value = e.clientY - canvas.value.offsetTop - 100
    ctx.lineTo(mouseX.value, mouseY.value)
    ctx.stroke()
}
const clear = () => {
    const w = canvas.value.width
    const h = canvas.value.height
    context.value.beginPath()
    context.value.clearRect(0, 0, w, h)
}

onMounted(() => {
    canvas.value = document.getElementById("canvas")
    context.value = canvas.value.getContext("2d")
})
</script>

<style scoped>
.clear-button {
    position: absolute;
}
</style>