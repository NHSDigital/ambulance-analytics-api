const postAmbulanceData = require('./postAmbulanceData')
const getStatus = require('./getStatus')

const routes = [].concat(postAmbulanceData, getStatus)

module.exports = routes
