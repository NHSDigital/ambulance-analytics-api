const fs = require('fs')
const puppeteer = require('puppeteer')

async function writeEnvAndGlobals() {
  const apigeeEnv = process.env.APIGEE_ENVIRONMENT;
  const serviceBasePath = process.env.SERVICE_BASE_PATH;
  const baseUrl = `https://${apigeeEnv}.api.service.nhs.uk/${serviceBasePath}`

  const apikey = process.env.API_KEY;

  const nhsUsername = process.env.NHS_ID_USERNAME;
  const nhsPassword = process.env.NHS_ID_PASSWORD;
  const loginUrl = process.env.IDP_URL; // url which we use username and password to get the token

  await writePostmanGlobals(loginUrl, nhsUsername, nhsPassword, apikey);
  await writePostmanEnvironment(baseUrl, apigeeEnv);
}

async function getToken(loginUrl, nhsUsername, nhsPassword) {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_BIN || null,
    args: ['--no-sandbox', '--headless', '--disable-gpu']
  });

  const gotoLogin = async () => {
    const page = await browser.newPage();
    await page.goto(loginUrl, { waitUntil: 'networkidle2', timeout: 10000 });
    await page.waitForSelector('#start', { timeout: 10000 });
    await page.click("#start");
    await page.waitForSelector('#idToken1', { timeout: 10000 });
    return page;
  }

  console.log('Oauth journey on ' + loginUrl);

  const page = await retry(async () => { return await gotoLogin(browser, loginUrl); }, 3);
  await page.type('#idToken1', nhsUsername);
  await page.type('#idToken2', nhsPassword);
  await page.click('#loginButton_0');
  await page.waitForNavigation();

  let credJson = await page.$eval('body > div > div > pre', e => e.innerText);
  let credentials = JSON.parse(credJson.replace(/'/g, '"'));

  await browser.close();

  return credentials.access_token;
}

async function writePostmanGlobals(loginUrl, nhsUsername, nhsPassword, apikey) {
  fs.copyFileSync("e2e/local.globals.json", "e2e/deploy.globals.json");
  let globals = JSON.parse(fs.readFileSync("e2e/deploy.globals.json"));

  for(let i = 0; i < globals.values.length; i++) {
    if (globals.values[i].key === "token") {
      if (!loginUrl || !nhsPassword || !nhsUsername) {
        console.log("Your global file has 'token' key but, one/more of NHS_ID_USERNAME or NHS_ID_PASSWORD or IDP_URL environment variables are not provided")
        continue;
      }
      const token = await getToken(loginUrl, nhsUsername, nhsPassword);

      globals.values[i] = {
        "key": "token",
        "value": token,
        "enabled": true
      };
    }

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
