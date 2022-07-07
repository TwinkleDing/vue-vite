<template>
    <div class="nested nested-1">
        嵌套路由
        <div class="nested nested-2">
            嵌套路由1
            <div class="nested nested-3"> 嵌套路由1-1 </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.nested {
    display: flex;
    flex-direction: column;
    padding: 20px;
    &-1 {
        background-color: #f4f4f5;
        color: #909399;
    }
    &-2 {
        margin-left: 100px;
        background-color: #e7faf0;
        color: #13ce66;
    }
    &-3 {
        margin-left: 100px;
        background-color: #fff8e6;
        color: #ffba00;
    }
}
</style>