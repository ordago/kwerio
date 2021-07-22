SHELL := /bin/bash

ifeq (,$(wildcard .env))
$(error Please create a .env, you can use .env.example as a base template)
endif

include .env
export

compose_files := --file docker-compose.yml

ifeq ($(APP_DEBUG), true)
	compose_files := --file docker-compose.dev.yml ${compose_files}
	include dev.Makefile
else
	compose_files := --file docker-compose.prod.yml ${compose_files}
	include prod.Makefile
endif
