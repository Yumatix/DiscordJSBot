const fs = require("fs");
const extend = require("extend");

var config = {
    name: "CielBot",
    version: "0.0.3 Pre-Alpha",
    release_date: "2018-12-30"
};

var external_config = JSON.parse(fs.readFileSync("./config.json"));

extend(false, config, external_config);
module.exports = config;


