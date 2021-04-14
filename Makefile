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
	if [ -f .env ]; then \
		docker-compose --file docker-compose.prod.yml up \
			--build \
			--abort-on-container-exit \
			--remove-orphans; \
	else \
		cp .env.example .env; \
		echo "Please fill in .env file"; \
	fi;

prod_clear_all_cache:
	docker exec -it kwerio php artisan clear-compiled
	docker exec -it kwerio php artisan auth:clear-resets
	docker exec -it kwerio php artisan cache:clear
	docker exec -it kwerio php artisan config:clear
	docker exec -it kwerio php artisan event:clear
	docker exec -it kwerio php artisan optimize:clear
	docker exec -it kwerio php artisan route:clear
	docker exec -it kwerio php artisan view:clear
