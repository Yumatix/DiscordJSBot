module.exports.summon = function(args){
    var message = args[1];
    if (!message.guild) message.channel.send("Sorry, I can only join servers!");
    if (message.member.voiceChannel){
        message.member.voiceChannel.join().then(connection => {
            console.log(`Summoned by ${message.author}(${message.author.username}) to channel ${connection.channel}(${connection.channel.name}) on guild ${connection.channel.guild}(${connection.channel.guild.name})`);
            });
    }
};
module.exports.summon.syntax = "summon";
module.exports.summon.description = "Summon the bot to your voice channel.";