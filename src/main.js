"use strict";
/**
 * Main script
 */
Error.stackTraceLimit = Infinity;

process.umask(0);

var mode = process.argv[2];
if (!mode) {
    process.stdout.write("Usage: node main.js start|update-all-widgets|install-widget|install-core-widgets");
    process.exit(0);
    return;
}

if (mode == "start") {
    if (process.env.RWA_ENV == "TRUE") {
        require(__dirname + "/env")
    }
    require(__dirname + "/routes");
    require(__dirname + "/rconserver");
    require(__dirname + "/websocketmgr");
    require(__dirname + "/steamapi");
    require(__dirname + "/config");
    require(__dirname + "/core");
    return;
}

var Widget = require(__dirname + "/widget");

// update all existing widgets
if (mode == "update-all-widgets") {
    var widgets = Widget.getAllWidgetIds();
    var cbCount = 0;
    for (var i = 0; i < widgets.length; i++) {
        var widget = Widget.get(widgets[i]);
        if (widget && widget.manifest) {
            (function (widget) {
                Widget.install(widget.manifest.repository, function (success) {
                    process.stdout.write("Widget " + widget.manifest.repository + " " + (success ? "successfully updated" : "error") + "\n");
                    cbCount++;
                    if (cbCount == widgets.length) {
                        process.exit(0);
                    }
                });
            })(widget);
        }
    }
}

// update core
if (mode == "update-core") {
    // EG: Cripple update
    // var request = require(__dirname + "/request");
    // var fs = require("fs");
    // var unzip = require("unzip");
    // //Get the update zip from the git repository
    // request.get("https://codeload.github.com/rcon-web-admin/rcon-web-admin/zip/master", true, function (contents) {
    //     if (!contents.length) {
    //         console.error("Cannot load rcon-web-admin zip file");
    //         process.exit(0);
    //         return;
    //     }
    //     var dir = __dirname + "/..";
    //     //Write the downloaded zip to a file
    //     fs.writeFile(dir + "/master.zip", contents, {"mode": 0o777}, function () {
    //         fs.createReadStream(dir + "/master.zip").pipe(unzip.Parse()).on('entry', function (entry) {
    //             var fileName = entry.path.split("/").slice(1).join("/");
    //             if (!fileName.length) return;
    //             var path = dir + "/" + fileName;
    //             if (entry.type == "Directory") {
    //                 if (!fs.existsSync(path)) fs.mkdirSync(path, 0o777);
    //                 entry.autodrain();
    //             } else {
    //                 entry.pipe(fs.createWriteStream(path));
    //             }
    //         }).on("close", function () {
    //             process.stdout.write("Rcon web admin successfully updated\n");
    //             fs.unlinkSync(dir + "/master.zip");
    //             process.exit(0);
    //         });
    //     });
    // });
}

// update/install a single widget
if (mode == "install-widget") {
    var widgetRepository = process.argv[3];
    if (!widgetRepository) {
        process.stdout.write("Usage: node main.js install-widget widgetRepositoryHere");
        process.exit(-1);
    }
    Widget.install(widgetRepository, function (success) {
        process.stdout.write("Widget " + widgetRepository + " " + (success ? "successfully installed" : "error") + "\n");
        process.exit(0);
    });
}

// install core widgets
if (mode == "install-core-widgets") {
    var widgetNames = process.argv.slice(3);
    var coreWidgets = [];
    if (widgetNames.length === 0) {
        widgetNames = ["autobot", "rustboard", "timedcommands"];
        coreWidgets.push("emilgardis/rwa-console");
    }

    coreWidgets = coreWidgets.concat(widgetNames.map(widget =>  (!widget.includes("/")) ?  "rcon-web-admin/rwa-" + widget : widget));
    var cbCount = 0;
    for (var i = 0; i < coreWidgets.length; i++) {
        (function (index) {
            Widget.install(coreWidgets[index], function (success) {
                process.stdout.write("Widget " + coreWidgets[index] + " " + (success ? "successfully installed" : "error") + "\n");
                cbCount++;
                if (cbCount == coreWidgets.length) {
                    process.exit(0);
                }
            });
        })(i);
    }
}
