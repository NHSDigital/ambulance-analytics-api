const postDatasetId = require('./post-dataset-id')
const getStatus = require('./get-status')

const routes = [].concat(postDatasetId, getStatus)

module.exports = routes
