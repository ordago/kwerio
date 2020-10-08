#!/bin/bash

set -ex

apt-get update
apt-get upgrade -y
rm -rf /var/lib/apt/lists/*

hostname -I | awk -F "." '{ print $1"."$2"."$3".1 host.docker.internal" }' >> /etc/hosts

usermod --non-unique --uid $USER_ID www-data
groupmod --non-unique --gid $GROUP_ID www-data

cd /var/www/html

if [ -L public/storage ]; then
    rm -f public/storage
fi

if [ -d node_modules ]; then
    rm -rf node_modules
fi

if [ -d vendor ]; then
    rm -rf vendor
fi

rm -f public/*.js
rm -rf public/fonts
rm -rf public/js

npm install
npm run prod

composer install

php artisan storage:link
chown -h www-data:www-data public/storage

if [ -n "$(ls -A storage/logs 2>/dev/null)" ]; then
    rm -rf storage/logs/*
fi

if [ ! -f .env ]; then
    cp .env.example .env
    php artisan key:generate
fi

chmod g+s storage/logs
setfacl -d -m u::rwX,g::rwX,o::r- storage/logs

chown -R www-data:www-data /var/www/html

# for: php artisan tinker
if [ ! -d /var/www/.config ]; then
    mkdir /var/www/.config
fi

chown www-data:www-data /var/www/.config

# for: npm
if [ ! -d /var/www/.npm ]; then
    mkdir /var/www/.npm
fi

chown www-data:www-data /var/www/.npm

apache2-foreground
