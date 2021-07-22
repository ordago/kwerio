run:
	@docker-compose ${compose_files} \
		up \
			--build \
			--detach

exec:
	@docker-compose ${compose_files} \
		exec \
			-u ${DOCKER_USER_ID} \
			app \
			bash

clear:
	@docker-compose ${compose_files} \
		exec \
			-u ${DOCKER_USER_ID} \
			app \
			php artisan optimize:clear
