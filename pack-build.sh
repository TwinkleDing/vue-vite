echo '---------- 构建vue主应用 ----------'
cd main-vue-application
yarn
yarn buildMain
cd ../
echo '---------- 主应用构建完成，回到根目录 ----------'

echo '---------- 构建vue微应用 ----------'
cd micro-vue-application
yarn
yarn buildMicro
cd ../
echo '---------- vue微应用构建完成，回到根目录 ----------'

echo '---------- 构建react微应用 ----------'
cd micro-react-application
yarn
yarn buildMicro
cd ../
echo '---------- react微应用构建完成，回到根目录 ----------'

echo '---------- 构建完成 ----------'
