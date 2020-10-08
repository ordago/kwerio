FROM composer:2.0.0-RC1 as composer
FROM node:14.13.0-buster AS node
FROM php:7.4.11-apache-buster

LABEL maintainer="Oussama Elgoumri <euvoor@gmail.com>"

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=UTC

# ----------------------------------------------------------------------------
#                                                                   TimeZone -
RUN ln -nfs /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone

# ----------------------------------------------------------------------------
#                                                       Install dependencies -
#
RUN set -ex \
    && apt-get update && apt-get upgrade -y

RUN set -ex \
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
        tzdata

# ----------------------------------------------------------------------------
#                                                           Install binaries -
#
COPY --from=composer /usr/bin/composer /usr/local/bin/composer
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules

RUN set -ex \
    && ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -s /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx

# ----------------------------------------------------------------------------
#                                              Install/Enable php extensions -
#
RUN set -ex \
    && docker-php-ext-configure gd \
        --with-jpeg

RUN set -ex \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        zip \
        intl \
        opcache \
        pcntl \
        pdo_mysql \
        pdo_pgsql \
        gd

RUN set -ex \
    && mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"

COPY .docker/dev.xdebug.ini /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

RUN set -ex \
    && pecl install \
        redis \
        xdebug \
    && docker-php-ext-enable \
        redis \
        xdebug

# ----------------------------------------------------------------------------
#                                                      Apache2 configuration -
#
COPY .docker/dev.kwerio.conf /etc/apache2/sites-available/000-default.conf
COPY .docker/dev.setup.sh /root/setup.sh

RUN set -ex \
    && a2enmod deflate \
        mime \
        rewrite

# ----------------------------------------------------------------------------
#                                                                    Cleanup -
#
RUN set -ex \
    && rm -rf /tmp/* \
    && rm -rf /var/lib/apt/lists/*
