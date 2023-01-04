echo '---------- 构建主应用 ----------'
cd main-application
yarn
yarn build

# echo '---------- 打包主应用 ----------'
# cd ../
# cd dist

# echo '---------- 清除上次的包 ----------'
# rm ./MainApp.tar.gz

# echo '---------- 开始打包 ----------'
# tar -zcvf ./MainApp.tar.gz ./MainApp

# echo '---------- 打包结束 ----------'

echo '---------- 主应用打包完成，回到根目录 ----------'
cd ../

echo '---------- 构建微应用 ----------'
cd micro-application
yarn
yarn build

# echo '---------- 打包微应用 ----------'
# cd ../
# cd dist

# echo '---------- 清除上次的包 ----------'
# rm ./MicroApp.tar.gz

# echo '---------- 开始打包 ----------'
# tar -zcvf ./MicroApp.tar.gz ./MicroApp

# echo '---------- 打包结束 ----------'
