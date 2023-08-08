---

分支介绍

- main: Vue 3 + Typescript + Vite 前端项目
- qiankun: 使用 qiankun 的包含 vue 和 react 的微前端项目
- draw: 使用了 websocket 在 vue 和 node 间进行接收和分发信息的你画我猜项目

---

# Vue 3 + Typescript + Vite

## 简介

- 此项目为 vue + java 的前后端可联调项目
- 可以进行游客预览，也可以进行与后端联调的登录功能，其中只有嵌套路由中的需要配套 java 项目，其余皆可游客浏览
- 前端采用了 vue3 + ts 开发，主要用了 setup 语法，使用 vite 进行构建
- 后端部分采用了 springboot 和 mysql，项目地址[springboot](https://github.com/TwinkleDing/springboot)

## 功能

- 与配套 java 项目的登录或者游客登录
- 全局系统设置按钮
  - 主题色
    - 系统主题色
    - 顶栏主题
    - 菜单主题
  - 标签栏: 历史路由列表，可开关，可调整样式
  - 菜单位置: 左边或者顶部
  - 选择语言: 目前只做了中英文，但是英文下的布局时 rtl 反向语言样式
- 动态路由
- 支持多级路由嵌套
- 错误页面 404
- Echarts 图表
- 高德地图查看
- three 模型
- canvas 画布

## 备注

### nvm 命令

由于 vite 需要的版本较高，所以使用 nvm 进行 node 版本控制

```js
nvm -v // 查看nvm版本
nvm list // 显示已安装的版本（同 nvm list installed
nvm list available // 显示所有可以下载的版本

nvm install xxx // 安装xxx版本
nvm install latest // 安装最新版本

nvm use xxx // 切换到xxx版本
nvm uninstall xxx // 卸载xxx版本
```

### 便捷库

#### Vue Grid Layout

Vue Grid Layout 是一个类似于 Gridster 的栅格布局系统, 适用于 Vue.js，灵感来源于 React Grid Layout。
https://jbaysolutions.github.io/vue-grid-layout/

#### Vue Draggable

Vue.Draggable 是一款基于 Sortable.js 实现的 vue 拖拽插件。支持移动设备、拖拽和选择文本、智能滚动，可以在不同列表间拖拽、不依赖 jQuery 为基础、vue2 过渡动画兼容、支持撤销操作，总之是一款非常优秀的 vue 拖拽组件。
https://www.npmjs.com/package/vuedraggable

#### TroisJS

Trois（法语为Three）是一个Vue 3库，用于Three.JS，这是一个流行的WebGL库。
https://troisjs.github.io/

#### vue-scrollama

一个Vue组件，可轻松设置滚动驱动的交互（又称滚动讲演）。 在引擎盖下使用 Scrollama。
https://www.npmjs.com/package/vue-scrollama

#### Vue QR Code Reader