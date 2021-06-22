#!/bin/bash

set -eux

hostname -I | awk -F "." '{ print $1"."$2"."$3".1 host.docker.internal" }' >> /etc/hosts

# ----------------------------------------------------------------------------
#                                                           Update & Upgrade -
apt-get update
apt-get upgrade -y
rm -rf /var/lib/apt/lists/*

# ----------------------------------------------------------------------------
#                                                             User: www-data -
cd /var/www/html

groupmod --non-unique --gid $GROUP_ID www-data
usermod --non-unique --uid $USER_ID --shell /bin/bash www-data

# ----------------------------------------------------------------------------
#                                                     Compose & Dependencies -
if [ ! -d /var/www/.composer ]; then
    mkdir /var/www/.composer
    chown www-data:www-data /var/www/.composer
fi

if [ ! -d /var/www/html/vendor ]; then
    action="install"

    if [ ! -f /var/www/html/composer.lock ]; then
        action="update"
    fi

    su - www-data -c "cd /var/www/html; COMPOSE_HTTP_TIMEOUT=-1 composer ${action} --optimize-autoloader --no-dev"
fi

# ----------------------------------------------------------------------------
#                                                         NPM & Dependencies -
if [ ! -d /var/www/.config ]; then
    mkdir /var/www/.config
    chown www-data:www-data /var/www/.config
fi

if [ ! -d /var/www/.npm ]; then
    mkdir /var/www/.npm
    chown www-data:www-data /var/www/.npm
fi

if [ ! -d /var/www/html/node_modules ]; then
    su - www-data -c "cd /var/www/html; npm install"
    rm -f public/*.js
    rm -rf public/fonts
    rm -rf public/js
    su - www-data -c "cd /var/www/html; npm run prod"
fi

# ----------------------------------------------------------------------------
#                                                               Kwerio Files -
if [ ! `awk -F= '/APP_KEY/ { print $2  }' .env` ]; then
    su - www-data -c "cd /var/www/html; php artisan key:generate"
fi

if [ ! -L public/storage ]; then
    su - www-data -c "cd /var/www/html; php artisan storage:link"
fi

if [ -n "$(ls -A storage/logs 2>/dev/null)" ]; then
    rm -rf storage/logs/*
fi

su - www-data -c "cd /var/www/html; php artisan config:cache"
su - www-data -c "cd /var/www/html; php artisan route:cache"
su - www-data -c "cd /var/www/html; php artisan view:cache"
su - www-data -c "cd /var/www/html; php artisan event:cache"

chmod g+s storage/logs
setfacl -d -m u::rwX,g::rwX,o::r- storage/logs || true

# ----------------------------------------------------------------------------
#                                                              International -
if [ ! -d public/i18n ]; then
    su - www-data -c "mkdir -p public/i18n"
    su - www-data -c "node po2json.js"
fi

# ----------------------------------------------------------------------------
#                                                                        Run -
chown -R $USER_ID:$GROUP_ID /var/www/html

apache2-foreground
