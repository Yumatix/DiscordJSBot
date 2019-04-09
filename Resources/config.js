//Import libraries
const args = require("minimist")(process.argv.slice(2));
const extend = require("extend");

//Grab environment from args
var environment = args.env || "dev";

//Common configuration
var common_conf = {
    name : "CielBot",
    version : "0.1.0",
    development_stage : "alpha",
    environment : environment,
    using_database : (args.nodb ? false : true),
    database_cache_rate : 120000,
    default_command_prefix : "/",
    stream_music: true
}

//Environment configuration
var conf = {
    prod : {
        database_uri: args.dburi || "mongodb+srv://kristinosis:W1!d3Ycs5@cluster0-zlmg0.mongodb.net",
        database_name: "CielBot"
    },

    dev : {
        database_uri: args.dburi || "mongodb+srv://kristinosis:W1!d3Ycs5@cluster0-zlmg0.mongodb.net",
        database_name: "CielBot-Test"
    }
}

//Extend the conf modes
extend(false, conf.prod, common_conf);
extend(false, conf.dev, common_conf);

module.exports = config = conf[environment];