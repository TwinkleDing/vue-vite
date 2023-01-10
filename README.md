***
分支介绍
-   main: Vue 3 + Typescript + Vite 前端项目
-   qiankun: 使用 qiankun 的包含 vue 和 react 的微前端项目
-   draw: 使用了 websocket 在 vue 和 node 间进行接收和分发信息的你画我猜项目
***
# Vue 3 + Typescript + Vite

## 简介

-   此项目为 vue + java 的前后端可联调项目
-   可以进行游客预览，也可以进行与后端联调的登录功能，其中只有嵌套路由中的需要配套 java 项目，其余皆可游客浏览
-   前端采用了 vue3 + ts 开发，主要用了 setup 语法，使用 vite 进行构建
-   后端部分采用了 springboot 和 mysql，项目地址[springboot](https://github.com/TwinkleDing/springboot)

## 功能

-   与配套 java 项目的登录或者游客登录
-   全局系统设置按钮
    -   主题色
        -   系统主题色
        -   顶栏主题
        -   菜单主题
    -   标签栏: 历史路由列表，可开关，可调整样式
    -   菜单位置: 左边或者顶部
    -   选择语言: 目前只做了中英文，但是英文下的布局时 rtl 反向语言样式
-   动态路由
-   支持多级路由嵌套
-   错误页面 404
-   Echarts 图表
-   高德地图查看
-   three 模型
-   canvas 画布
