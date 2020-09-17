const postAmbulanceData = require('./postAmbulanceData')
const getStatus = require('./getStatus')
const methodNotAllowed = require('./methodNotAllowed')

const routes = [].concat(postAmbulanceData, getStatus, methodNotAllowed)

module.exports = routes
