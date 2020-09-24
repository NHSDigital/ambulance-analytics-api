//<rs512_private_key> <rs256_private_key>
doc = `
API Management Postman Test Runner

Usage:
  test-runner.js  <client_id> <root_path> <base_url>
  test-runner.js -h | --help

  -h --help  Show this text.
`;

const newman = require('newman');
const fs = require('fs');
const path = require('path');
const docopt = require('docopt').docopt;

function main(args) {
  const environment = overwriteEnvironment(args);
  run(environment);
}

function overwriteEnvironment(args) {
  const {rs256Key, rs512Key, client_id, root_path, base_url } = {
    rs256Key: fs.readFileSync(path.resolve("test-256.key")).toString(),
    rs512Key: fs.readFileSync(path.resolve("test-512.key")).toString(),
    client_id: args['<client_id>'],
    root_path: args['<root_path>'],
    base_url: args['<base_url>'],
  }
  const environment = JSON.parse(fs.readFileSync(path.resolve("e2e/environments/internal-dev.postman.json")).toString())
  const values = environment["values"]

  const findAndOverride = (arr, key, value) => arr.filter(v => v.key === key).map(v => ({...v, value}))[0]

  const newValues = [
    findAndOverride(values, "RS256_PRIVATE_KEY", rs256Key),
    findAndOverride(values, "RS512_PRIVATE_KEY", rs512Key),
    findAndOverride(values, "client_id", client_id),
    findAndOverride(values, "base_url", base_url),
    findAndOverride(values, "root_path", root_path),
  ]

  environment['values'] = newValues

  return environment
}

function run(environment) {
  const collectionPath = path.resolve(`e2e/ambulance_analytics.json`)
  const collection = JSON.parse(fs.readFileSync(collectionPath).toString())

  newman.run({
      collection,
      reporters: ['cli', 'junit'],
      reporter: {
        junit: {
          export: './test-report.xml',
        },
      },
      environment
    },
  )
}

args = docopt(doc);
main(args)
