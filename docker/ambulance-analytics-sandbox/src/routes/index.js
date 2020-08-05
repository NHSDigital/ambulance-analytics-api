const postDatasetId = require('./post-dataset-id')
const getStatus = require('./get-status')
const badRequest = require('./bad-request')

const routes = [].concat(postDatasetId, getStatus, badRequest)

module.exports = routes
