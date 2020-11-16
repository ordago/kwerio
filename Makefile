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

# ------------------------------------------------------------ PRODUCTION -- #
prod:
	docker-compose --file docker-compose.prod.yml up \
		--build \
		--abort-on-container-exit \
		--remove-orphans
