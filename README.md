# qiankun 微应用项目

- 使用 qiankun 进行微应用项目开发
- 主应用使用了 vue3+vite+ts

<!-- 子应用有 vue 和 react 双版本 -->

主应用和子应用都在同一文件夹下开发。包含一键构建，打包功能：npm run build\yarn build 即可进行一键打包，调用 pack-build.sh 中的脚本进行构建，然后再执行 zip.js 中的 archiver 进行压缩代码进行打包。如后期要进行新增项目，需手动在 zip.js 和 pack-build.sh 中增加对应项目
