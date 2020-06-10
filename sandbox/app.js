var ApiMocker = require('apimocker');
var options = {};

ApiMocker.createServer(options)
    .setConfigFile('config.json')
    .start();
