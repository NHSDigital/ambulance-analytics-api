//<rs256_private_key> <client_id> <root_path> <base_url>
doc = `
API Management Postman Test Runner

Usage:
  test-runner.js <rs512_private_key>
  test-runner.js -h | --help

  -h --help  Show this text.
`;

const newman = require('newman');
const fs = require('fs');
const path = require('path');
const docopt = require('docopt').docopt;

function main(args) {
  console.log(args['<rs512_private_key>'])

}

function run(args) {
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
      environment: {

      },
    },
  )

}

args = docopt(doc);
main(args)
