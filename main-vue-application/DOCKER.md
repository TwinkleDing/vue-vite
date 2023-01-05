### 都在linux下操作

* docker pull nginx docker 获取nginx镜像
* docker images 查看已拉去的镜像
* docker rmi name 删除镜像
* 新增nginx文件夹及default.conf和Dockerfile文件 
* docker build -t vuenginxcontainer .  基于Dockersfile构建Vue应用镜像
* docker image ls | grep vuenginxcontainer 查看本地镜像
* docker run -p 3000:80 -d --name VueApp vuenginxcontainer 启动容器
* docker ps -a 查看所有容器
* docker start id 启动容器
* docker stop id 停止容器
* docker rm -f id 删除容器
* docker run  -itd --name ubuntu-test ubuntu /bin/bash 后台启动

>1. sudo groupadd docker     #添加docker用户组
>2. sudo gpasswd -a $USER docker     #将登陆用户加入到docker用户组中
>3. newgrp docker     #更新用户组
>4.  docker ps    #测试docker命令是否可以使用sudo正常使用