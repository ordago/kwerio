FROM composer:2.0.4 as composer
FROM node:15.0.1-buster AS node
FROM php:7.4.12-apache-buster

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
    && mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

RUN set -ex \
    && pecl install \
        redis \
    && docker-php-ext-enable \
        redis

# ----------------------------------------------------------------------------
#                                                      Apache2 configuration -
#
COPY .docker/prod.kwerio.conf /etc/apache2/sites-available/000-default.conf
COPY .docker/prod.setup.sh /root/setup.sh

RUN set -ex \
    && a2enmod deflate \
        mime \
        rewrite \
        headers

# ----------------------------------------------------------------------------
#                                                                    Cleanup -
#
RUN set -ex \
    && rm -rf /tmp/* \
    && rm -rf /var/lib/apt/lists/*