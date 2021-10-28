# Ambulance Load Test Utility

This is a cointainerized version of Locust configured to perform load test on any application restricted proxy.

## Development

### Requirements
* Docker
* Python3

### Install
In order to perform authentication please copy your secret key for the client assertion inside the ./secrets and rename it to "jwtRS512.key"
Then...

Create docker container
```
docker build -t locust .
```

Export the corresponding environment variables on your shell.
```
export AUTH_URL = 'https://int.api.service.nhs.uk/oauth2' 
export PRIVATE_KEY_PATH="/opt/secrets/jwtRS512.key"
export CLIENT_ID="" #Client ID from the testing app 
export CLIENT_SECRET="" #Client Secret from the testing app
export AUD="https://int.api.service.nhs.uk/oauth2/token"
export TARGET_BASE_PATH="https://int.api.service.nhs.uk/ambulance-data-submission"
```
### Testing
Run the container mounting the ./secrets folder as a volume.
```
docker run  -p8089:8089 -v $(pwd)/secrets:/opt/secrets -e AUTH_URL=$AUTH_URL -e PRIVATE_KEY_PATH=$PRIVATE_KEY_PATH -e CLIENT_ID=$CLIENT_ID -e CLIENT_SECRET=$CLIENT_SECRET AUD=$AUD TARGET_BASE_PATH=$TARGET_BASE_PATH locust
```

### To do:
Define the data to be sended on the request to ambulance...