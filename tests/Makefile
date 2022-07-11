-include .env

JWT_RS512_PRIVATE_KEY=$(shell cat $(shell pwd)/jwtRS512.key)

.EXPORT_ALL_VARIABLES:

run:
	envsubst < ./e2e/environments/internal-dev.postman.json > ./e2e/environments/prefilled.internal-dev.postman.json
	docker run -v $(shell pwd)/e2e:/etc/newman postman/newman run ambulance_analytics.json \
                  --folder "Init Test Suite" --folder "Happy Path Tests" \
                  --environment /etc/newman/environments/prefilled.internal-dev.postman.json --reporters=cli,junit
