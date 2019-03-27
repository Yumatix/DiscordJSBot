module.exports.skip = function(args){
    var message = args[1];

    //If the bot isn't in a voice channel, cancel.
    if (!message.guild.voiceConnection || (message.guild.queue && message.guild.queue.getCurrentSong() == null)) {
        message.channel.send("I'm not playing anything!");
        return;
    }

    //If the message author isn't in the same voice channel as the client, reject the request.
    if (!message.member.voiceChannel || message.member.voiceChannel != message.guild.voiceConnection.channel){
        message.channel.send("You're not in my voice channel, I can't accept that!");
        return;
    }

    message.guild.queue.skip();
};
module.exports.skip.syntax = "skip";
module.exports.skip.description = "Skip the current playing song. (Voting procedures for 'skip' coming soon)";
