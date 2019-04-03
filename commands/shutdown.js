module.exports.shutdown = function(args){
    var client = args[0];
    var message = args[1];
    console.log("Shutting down bot...");
    client.destroy().then(() => process.exit());
};
module.exports.shutdown.syntax = "shutdown";
module.exports.shutdown.description = "Closes all connections and shuts down the bot completely.";
module.exports.shutdown.cli = true;