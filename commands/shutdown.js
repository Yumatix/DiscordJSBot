module.exports.shutdown = function(args){
    var client = args[0];
    var message = args[1];
    console.log("Shutting down bot...");
    if (message) {message.channel.send("Shutting down... goodbye! :wave:").then(function(){
        client.destroy();
        process.exit();
    })}
    else {
        client.destroy(); 
        process.exit();
    }
};
module.exports.shutdown.syntax = "shutdown";
module.exports.shutdown.description = "Closes all connections and shuts down the bot completely.";
module.exports.shutdown.cli = true;