run:
	@docker-compose ${compose_files} \
		up \
			--build \
			--abort-on-container-exit \
			--remove-orphans

hot:
	@docker-compose ${compose_files} \
		exec \
			-u ${DOCKER_USER_ID} \
			app \
			npm run hot

exec:
	@docker-compose ${compose_files} \
		exec \
			-u ${DOCKER_USER_ID} \
			app \
			bash
