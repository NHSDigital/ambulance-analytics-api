SHELL=/bin/bash -euo pipefail

install: install-node install-python install-hooks

install-python:
	poetry install

install-node:
	npm install --legacy-peer-deps
	cd docker/ambulance-analytics-sandbox && npm install --legacy-peer-deps

install-hooks:
	cp scripts/pre-commit .git/hooks/pre-commit

test:
	npm run test

lint:
	npm run lint
	cd docker/ambulance-analytics-sandbox && npm run lint && cd ..
	poetry run flake8


validate: generate-examples
	java -jar bin/org.hl7.fhir.validator.jar build/examples/**/*application_fhir+json*.json -version 4.0.1 -tx n/a | tee /tmp/validation.txt

clean:
	rm -rf build
	rm -rf dist

publish: clean
	npm run publish 2> /dev/null

serve: update-examples
	npm run serve

generate-examples: publish
	mkdir -p build/examples
	poetry run python scripts/generate_examples.py build/ambulance-analytics.json build/examples

update-examples: generate-examples
	make publish

check-licenses:
	npm run check-licenses
	scripts/check_python_licenses.sh

deploy-proxy: update-examples
	scripts/deploy_proxy.sh

deploy-spec: update-examples
	scripts/deploy_spec.sh

format:
	poetry run black **/*.py

sandbox: update-examples
	cd docker/ambulance-analytics-sandbox && npm run start

build-proxy:
	scripts/build_proxy.sh

release: clean publish build-proxy
	mkdir -p dist
	tar -zcvf dist/package.tar.gz build
	cp -r build/. dist
	cp -r tests dist
	for env in internal-dev-sandbox internal-qa-sandbox sandbox; do \
		cp ecs-proxies-deploy.yml dist/ecs-deploy-$$env.yml; \
	done
