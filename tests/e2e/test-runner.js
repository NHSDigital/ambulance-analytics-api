doc = `
API Management Postman Test Runner

Usage:
  test-runner.js <service_name> <environment> [<base_path>]
  test-runner.js -h | --help

  -h --help  Show this text.
`

const docopt = require('docopt').docopt
const fs = require('fs')
const path = require('path')
const newman = require('newman')

function collectionRunner(serviceName, environmentName, basePath, credentials) {
  const collectionPath = environmentName === 'sandbox'
    ? path.resolve(`e2e/${serviceName}.sandbox.collection.json`)
    : path.resolve(`e2e/${serviceName}.collection.json`)

  const environmentPath = path.resolve(`e2e/environments/${environmentName}.postman.json`)

  const collection = JSON.parse(fs.readFileSync(collectionPath).toString())
  const environment = JSON.parse(fs.readFileSync(environmentPath).toString())


  const globals = overrideGlobals(basePath, credentials)

  const callback = err => {
    if (err) { throw err; }
    console.log('collection run complete!');
  }

  newman.run({
    collection,
    reporters: ['cli', 'junit'],
    reporter: {
      junit: {
        export: './test-report.xml'
      }
    },
    environment,
    globals

  }, callback)
    .on("start", () => {
      const filterValue = (e, key) => e['values'].filter(v => v.key === key)[0]['value']
      const url = `${filterValue(environment, "baseUrl")}${filterValue(globals, "basePath")}` //concatenates <baseUrl><basePath>

      console.log('Running against ' + url);
      console.log('Using collection file ' + collectionPath);
      console.log('Using environment file ' + environmentPath);
    })
}

function main(args) {
  const credentials = getCredentialsFromEnv()

  collectionRunner(args['<service_name>'], args['<environment>'], args['<base_path>'], credentials)
}

function getCredentialsFromEnv() {
  const accessToken = process.env['ACCESS_TOKEN']
  if (!accessToken) {
    throw new Error("ACCESS_TOKEN is required.")
  }

  const apiSecret = process.env['API_SECRET']
  if (!apiSecret) {
    throw new Error("API_SECRET is required.")
  }

  const apiKey = process.env['API_KEY']
  if (!apiKey) {
    throw new Error("API_KEY is required.")
  }

  return {
    apiSecret: apiSecret.trim(),
    apiKey: apiKey.trim(),
    accessToken: accessToken.trim()
  }
}

function overrideGlobals(basePath, {apiKey, apiSecret, accessToken}) {
  const globals = JSON.parse(fs.readFileSync(path.resolve("e2e/globals.json")).toString())
  const values = globals["values"]


  const authBase64 = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')

  const findAndOverride = (arr, key, value) => arr.filter(v => v.key === key).map(v => ({...v, value}))[0]

  const newValues = [
    findAndOverride(values, "basePath", basePath),
    findAndOverride(values, "accessToken", accessToken),
    findAndOverride(values, "authBase64", authBase64),
    findAndOverride(values, "datasetId", "covid-19-research-tool"),
  ]

  globals['values'] = newValues

  return globals
}

args = docopt(doc)
main(args)
