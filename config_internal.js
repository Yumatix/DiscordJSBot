const fs = require("fs");
const extend = require("extend");

var config = {
    name: "DiscordJS Bot",
    version: "0.0.1"
};

var external_config = JSON.parse(fs.readFileSync("./config.json"));

extend(false, config, external_config);
module.exports = extend;


