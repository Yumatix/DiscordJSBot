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
    default_command_prefix : "/"
}

//Environment configuration
var conf = {
    prod : {
        database_uri: args.dburi || ""
    },

    dev : {
        database_uri: args.dburi || "mongodb+srv://kristinosis:<password>@cluster0-zlmg0.mongodb.net/CielBot"
    }
}

//Extend the conf modes
extend(false, conf.prod, common_conf);
extend(false, conf.dev, common_conf);

module.exports = config = conf[environment];