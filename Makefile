SHELL=/bin/bash -euo pipefail

install: install-node install-python install-hooks

install-python:
	poetry install

install-node:
	npm install
	cd docker/ambulance-data-sandbox && npm install

install-hooks:
	cp scripts/pre-commit .git/hooks/pre-commit

test:
	npm run test

lint:
	npm run lint
	cd docker/ambulance-data-sandbox && npm run lint && cd ..
	poetry run flake8
	find . -name '*.sh' | grep -v node_modules | xargs shellcheck

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
	poetry run python scripts/generate_examples.py build/ambulance-api.json build/examples

update-examples: generate-examples
	jq -rM . <build/examples/resources/Greeting.json >specification/components/examples/Greeting.json
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
	cd docker/ambulance-data-sandbox && npm run start

build-proxy:
	scripts/build_proxy.sh

release: clean publish build-proxy
	mkdir -p dist
	tar -zcvf dist/package.tar.gz build
	cp -r terraform dist
	cp -r build/. dist
	cp -r tests dist
