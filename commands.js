const extend = require("extend");

module.exports = commands = {};

//Import commands from folder
require("fs").readdirSync("./commands").forEach( file => {
    if (file.substr(-2) != "js") return;
    console.log("Importing command: " + file);
    extend(false, commands, require("./commands/" + file));
});