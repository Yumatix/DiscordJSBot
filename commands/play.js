const MusicQueue = require("./../musicQueue.js");

module.exports.play = function(args){
    var message = args[1];
    var url = args[2];

    //If the bot isn't in a voice channel, cancel.
    if (!message.guild.voiceConnection) {
        message.channel.send("I'm not in a voice channel!");
        return;
    }

    //If the message author isn't in the same voice channel as the client, reject the request.
    if (!message.member.voiceChannel || message.member.voiceChannel != message.guild.voiceConnection.channel){
        message.channel.send("You're not in my voice channel, I can't accept that!");
        return;
    }

    //Create a new queue for this guild, if it doesn't have one
    if (!message.guild.queue) message.guild.queue = new MusicQueue(message.guild);

    message.guild.queue.add(url, message.author.id);
}
module.exports.play.syntax = "play <url>";
module.exports.play.description = "Add a song to the music queue";