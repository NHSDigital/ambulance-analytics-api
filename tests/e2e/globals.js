const fs = require('fs')

async function writeEnvAndGlobals() {
  const apigeeEnv = process.env.APIGEE_ENVIRONMENT;
  const serviceBasePath = process.env.SERVICE_BASE_PATH;
  const baseUrl = `https://${apigeeEnv}.api.service.nhs.uk/${serviceBasePath}`

  /*
  const apikey = process.env.API_KEY;

  const nhsUsername = process.env.NHS_ID_USERNAME;
  const nhsPassword = process.env.NHS_ID_PASSWORD;
  const loginUrl = process.env.IDP_URL; // url which we use username and password to get the token
   */
  const token = `process.env.AMBULANCE_JWT_${apigeeEnv.toUpperCase().replace('-', '_')}`

  await writePostmanGlobals(token);
  await writePostmanEnvironment(baseUrl, apigeeEnv);
}

async function getToken() {

  // TODO: get token
  return "get token by GET /token";
}

async function writePostmanGlobals(token) {
  fs.copyFileSync("e2e/local.globals.json", "e2e/deploy.globals.json");
  let globals = JSON.parse(fs.readFileSync("e2e/deploy.globals.json"));

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


/*
    if (globals.values[i].key === "apikey") {
      if (!apikey) {
        console.log("Your global file has 'apikey' key but, API_KEY environment variable is not provided.")
        continue;
      }

      globals.values[i] = {
        "key": "apikey",
        "value": apikey,
        "enabled": true
      };
    }
*/
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

async function retry(func, times) {
  let result;
  let success = false;
  let error;

  for (let i = 0; i < times; i++) {
    try {
      result = await func();
      success = true;
      break;
    } catch (e) {
      error = e;
      console.error(e);
    }
    setTimeout(function(){ console.log("Waiting"); }, 2000 * i);
  }

  if (!success) {
    throw error;
  }

  return result;
}

async function main() {
  await writeEnvAndGlobals();
}

main()
