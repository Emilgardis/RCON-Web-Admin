"use strict";

var fs = require("fs");

/**
 * Default configuration
 * Override with local config.js file in root
 */
var config = {
    "host": null,
    "websocketUrlSsl": null,
    "websocketUrl": null,
    "port": 4326
};

if (process.env.RWA_WEBSOCKET_URL) {
    config["websocketUrl"] = process.env.RWA_WEBSOCKET_URL;
}

if (process.env.RWA_WEBSOCKET_URL_SSL) {
    config["websocketUrlSsl"] = process.env.RWA_WEBSOCKET_URL_SSL;
}

// load config.js if exist
if (fs.existsSync(__dirname + "/../config.js")) {
    var configLocal = require(__dirname + "/../config.js");
    for(var i in configLocal){
        config[i] = configLocal[i];
    }
}

process.stdout.write(JSON.stringify(config));

module.exports = config;
