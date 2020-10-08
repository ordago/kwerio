.PHONY: run

run:
	docker-compose --file docker-compose.dev.yml up \
		--build \
		--abort-on-container-exit \
		--remove-orphans
