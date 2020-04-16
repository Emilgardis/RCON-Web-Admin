"use strict"

var db = require(__dirname + "/db");
var fs = require("fs");
var hash = require(__dirname + "/hash");

var username = process.env.RWA_USERNAME || 'admin';
var readOnlyWidgetOptions = process.env.RWA_READ_ONLY_WIDGET_OPTIONS || 'FALSE'
var admin = process.env.RWA_ADMIN || 'FALSE'

var id = hash.saltedMd5(username);
var userData = {};

if (process.env.RWA_PASSWORD) {
    userData.password = hash.saltedMd5(process.env.RWA_PASSWORD);
} else {
    process.stdout.write("Error: environment variable RWA_PASSWORD must be set");
    process.exit(1);
    return;
}

userData.id = id;
userData.username = username;
userData.restrictcommands = process.env.RWA_RESTRICT_COMMANDS;
userData.restrictwidgets = process.env.RWA_RESTRICT_WIDGETS;
userData.readonlyoptions = readOnlyWidgetOptions.toUpperCase() == "TRUE";
userData.admin = admin.toUpperCase() == "TRUE";
userData.loginHash = hash.random(64);

db.get("users").set(id, userData).value();

var host = process.env.RWA_RCON_HOST || '127.0.0.1';
var webRcon = process.env.RWA_WEB_RCON || 'FALSE'

var id = hash.saltedMd5(host);
var serverData = {};

serverData.id = id;
serverData.game = process.env.RWA_GAME || 'minecraft';
serverData.name = process.env.RWA_SERVER_NAME || serverData.game;
serverData.host = host;
serverData.users = [username];
serverData.web = webRcon.toUpperCase() == "TRUE";
serverData.active = true;
serverData.rcon_port = parseInt(process.env.RWA_RCON_PORT) || 25575;
serverData.rcon_password = process.env.RWA_RCON_PASSWORD || '';

db.get("servers").set(id, serverData).value();
try { fs.mkdirSync(__dirname + "/../db/server_" + id, 0o777); } catch {}
