module.exports.ping = function(args){
    var message = args[1];
    message.channel.send("Pong!");
};
module.exports.ping.syntax = "ping";
module.exports.ping.description = "Pings the bot.";