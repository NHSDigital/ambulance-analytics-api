SHELL=/bin/bash -euo pipefail

install:
	 npm install

lint:
	npm run lint

build:
	docker build -t ambulance-data-api-sandbox .

run:
	docker run -p 9000:9000 ambulance-data-api-sandbox:latest

