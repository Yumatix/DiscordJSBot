module.exports.summonto = function(args){
    var message = args[1];
    if (args.length >= 3) {
        var channelName = args[2];
        if (channelToJoin = message.channel.guild.channels.find(channel => channel.name === channelName)){
            channelToJoin.join().then(connection => {
                console.log(`Summoned by ${message.author}(${message.author.username}) to channel ${connection.channel}(${connection.channel.name}) on guild ${connection.channel.guild}(${connection.channel.guild.name})`);
            });
        } else {
            message.channel.send(`Voice channel "${channelName}" not found on this server.`);
        }
    }
    else {
        message.channel.send("You must specify a channel to join!");
    }
};
module.exports.summonto.syntax = "summonto <channel_name>";
module.exports.summonto.description = "Summon the bot to a specific channel on the same server";