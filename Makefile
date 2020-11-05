.PHONY: up

# ----------------------------------------------------------- DEVELOPMENT -- #
up:
	docker-compose --file docker-compose.dev.yml up \
		--build \
		--abort-on-container-exit \
		--remove-orphans

hot:
	docker-compose --file docker-compose.dev.yml \
		exec \
		-u `id -u` \
		-w /var/www/html \
		app \
		npm run hot

exec:
	docker-compose --file docker-compose.dev.yml \
		exec \
		-u `id -u` \
		-w /var/www/html \
		app \
		bash

refresh:
	docker-compose --file docker-compose.dev.yml \
		exec \
		app \
		php artisan migrate:fresh --seed

# ------------------------------------------------------------ PRODUCTION -- #
prod:
	docker-compose --file docker-compose.prod.yml up \
		--build \
		--abort-on-container-exit \
		--remove-orphans

rebuild:
	composer install --optimize-autoloader --no-dev
	php artisan migrate
	php artisan config:cache
	php artisan route:cache
	php artisan view:cache
	npm install
	npm run prod
