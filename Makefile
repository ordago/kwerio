.PHONY: up

# ----------------------------------------------------------- DEVELOPMENT -- #
up:
	if [ -f .env ]; then \
		docker-compose --file docker-compose.dev.yml up \
			--build \
			--abort-on-container-exit \
			--remove-orphans; \
	else \
		cp .env.example .env; \
		echo "Please fill in .env file"; \
	fi;

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
	test -f .env || cp .env.example .env
	docker-compose --file docker-compose.prod.yml up \
		--build \
		--abort-on-container-exit \
		--remove-orphans
