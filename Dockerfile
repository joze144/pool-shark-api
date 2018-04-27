# create a file named Dockerfile
FROM daocloud.io/node

MAINTAINER Jozhe <joze.kosmerl@gmail.com>

# create app directory in container
RUN mkdir -p /app

# set /app directory as default working directory
WORKDIR /app

ADD package.json /app/

# Time Zone Enviroment
ENV TZ=Asia/Shanghai

# Install app dependencies
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN npm install cnpm -g --registry=https://registry.npm.taobao.org
RUN cnpm install pm2 -g
RUN cnpm install --ropsten

# copy all file from current dir to /app in container
COPY . /app/

EXPOSE 3030

CMD ["pm2-docker", "ecosystem.config.js", "--env", "ropsten"]
