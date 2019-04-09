module.exports.ping = function(args){
    var message = args[1];
    message.channel.send("Pong!").then(message => messageManager.addResponseMessage(message));
};
module.exports.ping.syntax = "ping";
module.exports.ping.description = "Pings the bot.";