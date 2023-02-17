### script 标签的 setup 属性是 setup 方法的语法糖

0. 组件不需要注册

1. 生命周期

```js
//Hook inside setup       // 选项式 API
// 没有reacted方法         // beforeCreate(){}
                          // created(){}
onBeforeMount(()=> {})    // beforeMount(){}
onMounted(()=> {})        // mounted(){}
onBeforeUnmount(()=> {})  // beforeUnmount(){}
onUnmounted(()=> {})      // unmounted(){}
```

2. ref 定义基本类型

```js
// 定义
const name = ref("Jerry")
// 修改
name.value = "Tom"
```

3. reactive 定义引用类型

```js
// 定义
const state = reactive({
    name: "Jerry",
    sex: "男"
})
// 修改
state.name = "Tom"
```

4. 方法直接声明

```js
const changeName = () => {
    state.name = "Tom"
}
```

5. computed

```js
import { computed, ref } from "vue"
const count = ref(1)

// 通过computed获得doubleCount
const doubleCount = computed(() => {
    return count.value * 2
})
```

6. watch

```js
import { watch, reactive } from "vue"
const state = reactive({
    count: 1
})
// 声明方法
const changeCount = () => {
    state.count = state.count * 2
}

// 监听count
watch(
    () => state.count,
    (newVal, oldVal) => {
        console.log(state.count)
        console.log(`watch监听变化前的数据：${oldVal}`)
        console.log(`watch监听变化后的数据：${newVal}`)
    },
    {
        immediate: true, // 立即执行
        deep: true // 深度监听
    }
)
```

7. 父子传值的 props 和 emit

```js
import { defineProps, defineEmits } from "vue"
// defineEmits和defineProps在<script setup>中自动可用，无需导入
// 需在.eslintrc.js文件中【globals】下配置【defineEmits: true】、【defineProps: true】
const props = defineProps({
    name: {
        type: String,
        default: ""
    }
})
// 声明 emit 事件
const emit = defineEmits(["updateName"])

const changeName = () => {
    emit("updateName", "Tom")
}
```

8. 子组件 ref 变量和 defineExpose

```js
// 子组件将方法、变量暴露给父组件使用，父组件才可通过ref API拿到子组件暴露的数据
import { reactive, toRefs } from "vue"
// 声明state
const state = reactive({
    name: "Jerry"
})
defineExpose({
    // 解构state
    ...toRefs(state),
    // 声明方法
    changeName() {
        state.name = "Tom"
    }
})

// 父组件
// 引入子组件
import child from "./child.vue"

// 子组件ref
const childRef = ref("childRef")
// nextTick
nextTick(() => {
    // 获取子组件name
    console.log(childRef.value.name)
    // 执行子组件方法
    childRef.value.changeName()
})
```

9. vuex 和 router

```js
import { useStore } from "vuex"
import { userRouter, userRoute } from "vue-router"

// 必须先声明调用
const store = useStore()
const router = useRouter()
const route = useRoute()
```

10. this 上的$绑定的方法

```js
import { getCurrentInstance } from "vue"
// 第一步将useRouter函数执行放在顶部，不然执行报错为undefined
const { proxy }: any = getCurrentInstance()
proxy.$store
proxy.$i18n
proxy.$message
proxy.$axios
```

11. 对 await 方法的支持，可以不用 async

```js
<script setup>const post = await fetch('/api').then(() => {})</script>
```

12. provide 和 inject

```js
// 父组件
import { provide } from 'vue'
// 声明provide
provide('provideState',
    changeName: () => {name.value = 'Tom'}
)
// 子组件
import { inject } from 'vue'
// 注入
const provideState = inject('provideState')

// 子组件触发name改变
provideState()
```
