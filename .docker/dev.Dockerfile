FROM composer:2.0.11 as composer
FROM node:15.12.0-buster AS node
FROM php:8.0.3-apache-buster

LABEL maintainer="Oussama Elgoumri <euvoor@gmail.com>"

ENV APP_URL="https://kwerio.test" \
    DEBIAN_FRONTEND="noninteractive" \
    GROUP_ID=1000 \
    LANG="C.UTF-8" \
    LC_ALL="C.UTF-8" \
    TERM=xterm \
    TZ="UTC" \
    USER_ID=1000

# ----------------------------------------------------------------------------
#                                                                   TimeZone -
RUN ln -nfs /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone

# ----------------------------------------------------------------------------
#                                                       Install dependencies -
RUN set -eux \
    && apt-get update && apt-get upgrade -y

RUN set -eux \
    && apt-get install \
        -y --no-install-recommends \
        libpq-dev \
        libzip-dev \
        git \
        zip \
        unzip \
        zlib1g-dev \
        libicu-dev \
        supervisor \
        vim \
        less \
        curl \
        acl \
        libjpeg-dev \
        libpng-dev \
        tzdata \
        pwgen \
        dos2unix \
        net-tools \
        htop \
        telnet \
        netcat-openbsd \
        strace \
        tcpdump

# ----------------------------------------------------------------------------
#                                                           Install binaries -
COPY --from=composer /usr/bin/composer /usr/local/bin/composer
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules

RUN set -eux \
    && ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -s /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx

# ----------------------------------------------------------------------------
#                                              Install/Enable php extensions -
RUN set -eux \
    && docker-php-ext-configure gd \
        --with-jpeg

RUN set -eux \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        zip \
        intl \
        opcache \
        pcntl \
        pdo_mysql \
        pdo_pgsql \
        gd \
        sockets

RUN set -eux \
    && mv $PHP_INI_DIR/php.ini-development $PHP_INI_DIR/php.ini

COPY .docker/dev.xdebug.ini PHP_INI_DIR/conf.d/docker-php-ext-xdebug.ini

# Install pickle
RUN set -eux \
    && curl -L -o /usr/local/bin/pickle https://github.com/FriendsOfPHP/pickle/releases/download/v0.7.2/pickle.phar \
    && chmod +x /usr/local/bin/pickle

# Install xdebug
RUN set -eux \
    && git clone -b 3.0.3 --depth 1 https://github.com/xdebug/xdebug.git /usr/src/php/ext/xdebug \
    && docker-php-ext-configure xdebug --enable-xdebug-dev \
    && docker-php-ext-install xdebug

# Install redis
RUN set -eux \
    && pickle install redis \
    && docker-php-ext-enable redis

# ----------------------------------------------------------------------------
#                                                      Apache2 configuration -
COPY .docker/dev.kwerio.conf /etc/apache2/sites-available/000-default.conf
COPY .docker/dev.setup.sh /root/setup.sh
RUN dos2unix /root/setup.sh

RUN set -eux \
    && a2enmod deflate \
        mime \
        rewrite \
        proxy \
        proxy_http \
        proxy_wstunnel \
        substitute

# ----------------------------------------------------------------------------
#                                                                    Cleanup -
RUN set -eux \
    && rm -rf /tmp/* \
    && rm -rf /var/lib/apt/lists/*
