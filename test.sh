#!/usr/local/bin/bash
test_dir=$(pwd)/tests/e2e

#JWT_RS256_PRIVATE_KEY="$(cat test-256.key)"
JWT_RS512_PRIVATE_KEY=$(cat test-512.key)
export JWT_RS256_PRIVATE_KEY

#echo $JWT_RS256_PRIVATE_KEY
echo $JWT_RS512_PRIVATE_KEY

#export JWT_RS256_PRIVATE_KEY=$(echo $JWT_RS256_PRIVATE_KEY | gsed -z 's/\n/\\n/g')
JWT_RS512_PRIVATE_KEY=$(echo $JWT_RS512_PRIVATE_KEY | gsed -z '2,$s/ /\\n/g')

#echo $JWT_RS256_PRIVATE_KEY | gsed -E ':a;N;$!ba;s/\r{0,1}\n/BBB/g' > first
#JWT_RS512_PRIVATE_KEY=$(echo $JWT_RS512_PRIVATE_KEY | gsed -E ':a;N;$!ba;s/\r{0,1}\n/\\n/g')
export JWT_RS512_PRIVATE_KEY

#echo $JWT_RS256_PRIVATE_KEY
echo $JWT_RS512_PRIVATE_KEY

envsubst < $test_dir/environments/internal-dev.postman.json > $test_dir/environments/prefilled.internal-dev.postman.json

#docker run -v ${test_dir}:/etc/newman postman/newman run ambulance_analytics.json --environment /etc/newman/environments/prefilled.internal-dev.postman.json --reporters=cli,junit
