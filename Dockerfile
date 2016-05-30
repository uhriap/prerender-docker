FROM node:latest

MAINTAINER Magnet.me

RUN apt-get update \
    && apt-get install -y \
        build-essential g++ flex bison gperf ruby perl \
        libsqlite3-dev libfontconfig1-dev libicu-dev libfreetype6 libssl-dev \
        libpng-dev libjpeg-dev python libx11-dev libxext-dev

RUN export PHANTOM_JS="phantomjs-2.1.1-linux-x86_64" && \
    DOWNLOAD_URL="https://bitbucket.org/ariya/phantomjs/downloads/${PHANTOM_JS}.tar.bz2" && \
    echo $DOWNLOAD_URL && \
    curl -L $DOWNLOAD_URL -vvv -O && \
    tar xvjf $PHANTOM_JS.tar.bz2 && \
    mv $PHANTOM_JS /usr/local/share && \
    ln -sf /usr/local/share/$PHANTOM_JS/bin/phantomjs /usr/local/bin

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
EXPOSE 3000

CMD [ "npm", "start" ]

