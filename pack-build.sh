echo '---------- 构建vue主应用 ----------'
cd main-vue-application
yarn
yarn build

echo '---------- 主应用打包完成，回到根目录 ----------'
cd ../

echo '---------- 构建vue微应用 ----------'
cd micro-vue-application
yarn
yarn build
