FROM composer:2.0.8 as composer
FROM node:15.4.0-buster AS node
FROM php:7.4.13-apache-buster

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
        dos2unix

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
        gd

RUN set -eux \
    && mv $PHP_INI_DIR/php.ini-production $PHP_INI_DIR/php.ini

COPY .docker/dev.xdebug.ini PHP_INI_DIR/conf.d/docker-php-ext-xdebug.ini

# Install pickle
RUN set -eux \
    && curl -L -o /usr/local/bin/pickle https://github.com/FriendsOfPHP/pickle/releases/download/v0.6.0/pickle.phar \
    && chmod +x /usr/local/bin/pickle

RUN set -eux \
    && pickle install redis \
    && docker-php-ext-enable redis

# ----------------------------------------------------------------------------
#                                                      Apache2 configuration -
COPY .docker/prod.kwerio.conf /etc/apache2/sites-available/000-default.conf
COPY .docker/prod.setup.sh /root/setup.sh
RUN dos2unix /root/setup.sh

RUN set -eux \
    && a2enmod deflate \
        mime \
        rewrite \
        headers \
        http2

RUN set -eux \
    && groupmod --non-unique --gid $GROUP_ID www-data \
    && usermod \
        --non-unique \
        --uid $USER_ID \
        --home /var/www \
        --root /var/www \
        --shell /bin/null \
        www-data

# ----------------------------------------------------------------------------
#                                                                    Cleanup -
RUN set -eux \
    && rm -rf /tmp/* \
    && rm -rf /var/lib/apt/lists/*
