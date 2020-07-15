const fs = require('fs')
const axios = require('axios')

async function writeEnvAndGlobals() {
  const apigeeEnv = process.env.APIGEE_ENVIRONMENT;
  const serviceBasePath = process.env.SERVICE_BASE_PATH;
  const baseUrl = `https://${apigeeEnv}.api.service.nhs.uk${serviceBasePath}`

  const apiKey = process.env.API_KEY;
  const apiSecret = process.env.API_SECRET;
  const token = process.env[`AMBULANCE_TOKEN_${apigeeEnv.toUpperCase().replace('-', '_')}`]

  await writePostmanGlobals(baseUrl, token, apiKey, apiSecret);
  await writePostmanEnvironment(baseUrl, apigeeEnv);
}

async function getAccessToken(baseUrl, token, apiKey, apiSecret) {
  const authBase64 = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
  console.log("base: ", baseUrl)
  return (async () => {
    try {
      return axios.get(`${baseUrl}/token`, {
        headers: {
          'token': token,
          'grant_type': 'client_credentials',
          'Authorization': `Basic ${authBase64}`
        }
      })
    } catch (e) {
      console.log(e)
    }

  })()
}

async function writePostmanGlobals(baseUrl, token, apiKey, apiSecret) {
  fs.copyFileSync("e2e/local.globals.json", "e2e/deploy.globals.json");
  let globals = JSON.parse(fs.readFileSync("e2e/deploy.globals.json"));
  const access_token = (await getAccessToken(baseUrl, token, apiKey, apiSecret)).data.access_token
  const authBase64 = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
  console.log("token: ", access_token)

  for(let i = 0; i < globals.values.length; i++) {
    if (globals.values[i].key === "token") {
      if (!token) {
        console.log("token is undefined. Pass this value via environment varibale")
        continue;
      }

      globals.values[i] = {
        "key": "token",
        "value": token,
        "enabled": true
      };
    }

    if (globals.values[i].key === 'auth_base64') {
      globals.values[i] = {
        "key": "auth_base64",
        "value": authBase64,
        "enabled": true
      }
    }

    if (globals.values[i].key === 'access_token') {
      globals.values[i] = {
        "key": "access_token",
        "value": access_token,
        "enabled": true
      }
    }
  }

  fs.writeFileSync('e2e/deploy.globals.json', JSON.stringify(globals));
}

async function writePostmanEnvironment(base_url, apigee_environment){
  let envVariables = JSON.parse(fs.readFileSync(`e2e/environments/${apigee_environment}.postman.json`));
  const baseUrl = {
    "key": "base_url",
    "value": base_url,
    "enabled": true
  };

  for (let i = 0; i < envVariables.values.length; i++) {
    if (envVariables.values[i].key === "base_url") {
      envVariables.values[i] = baseUrl;
      break;
    }
  }

  fs.writeFileSync(`e2e/environments/deploy.${apigee_environment}.postman.json`, JSON.stringify(envVariables));
}

async function main() {
  await writeEnvAndGlobals();
}

main()
