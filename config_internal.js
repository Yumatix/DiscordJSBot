const fs = require("fs");
const extend = require("extend");

var config = {
    name: "CielBot",
    version: "0.0.2"
};

var external_config = JSON.parse(fs.readFileSync("./config.json"));

extend(false, config, external_config);
module.exports = extend;


