#!/usr/local/bin/bash
test_dir=$(pwd)/e2e

JWT_RS512_PRIVATE_KEY=$(cat test-512.key)
JWT_RS256_PRIVATE_KEY=$(cat test-256.key)
echo "$JWT_RS512_PRIVATE_KEY" > test-512.out.key
echo "$JWT_RS256_PRIVATE_KEY" > test-256.out.key

docker run -v $(pwd):/usr/src/app -w /usr/src/app node:alpine sh -c "npm install && npm run test:release $CLIENT_ID ambulance-analytics-pr-68 internal-dev"
