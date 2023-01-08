# qiankun 微前端项目模板

- 使用 qiankun 进行微应用项目开发
- 主应用使用了 vue3+vite+ts
- vue 版本子应用使用了 vue3+vite
- react 版本子应用使用了 react18

## 一键构建与打包功能

- 建议使用 yarn 来代替 npm `npm install -g yarn`
- 打包功能: yarn build 即可进行一键打包，原理为调用 pack-build.sh 中的脚本进入到主应用与子应用中分别触发配置好的构建到根 dist 目录的功能，先会 yarn 一下初始化然后在开始 build
- 然后再执行 zip.js ，获取 dist 中的文件夹，然后使用 archiver 进行压缩代码进行打包。
- 如后期要进行新增项目，需手动在 pack-build.sh 中增加对应项目的 cd 切换项目

## 在主应用安装 qiankun

- yarn add qiankun
- 详情进入官网查看 [qiankun-快速上手](https://qiankun.umijs.org/zh/guide/getting-started)

## vue3+vite 新项目命令

<!-- 安装vue官方脚手架 -->

- yarn global add @vue/cli
- vue create `<app-name>`
- vue upgrade --next

### 安装 vite

- yarn create vite

### 使用 vite 构建 vue 项目

- yarn create vite `<app-name>` --template vue
<!-- 或者使用社区模板 -->
- npx degit user/project `<app-name>`

## react 新项目命令:

- npx create-react-app `<app-name>`
